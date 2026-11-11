#!/usr/bin/env bash
# Setup awal backend Laravel di Hostinger (Web/Cloud Hosting) lewat SSH.
#
# Pemakaian (dari folder hasil clone repo):
#   bash scripts/hostinger-setup.sh
#
# Script akan menanyakan data database dan akun admin. Password diketik
# tersembunyi dan hanya disimpan di backend/.env di server.
# Aman dijalankan ulang: .env lama dicadangkan, admin yang sudah ada tidak dibuat ulang.

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$REPO_DIR/backend"
cd "$BACKEND_DIR"

ask() { # ask <var> <prompt> [default]
  local __var=$1 __prompt=$2 __def=${3:-} __val
  if [ -n "$__def" ]; then read -r -p "$__prompt [$__def]: " __val; __val=${__val:-$__def}
  else read -r -p "$__prompt: " __val; fi
  printf -v "$__var" '%s' "$__val"
}
ask_secret() { # ask_secret <var> <prompt>
  local __var=$1 __prompt=$2 __a __b
  while true; do
    read -r -s -p "$__prompt: " __a; echo
    [ -n "$__a" ] || { echo "  Tidak boleh kosong."; continue; }
    read -r -s -p "Ulangi $__prompt: " __b; echo
    [ "$__a" = "$__b" ] && break
    echo "  Tidak sama, coba lagi."
  done
  printf -v "$__var" '%s' "$__a"
}
set_env() { # set_env KEY VALUE  -> tulis/ubah baris KEY=VALUE di .env
  local key=$1 val=$2 tmp
  # beri tanda kutip jika ada spasi/karakter khusus; escape \ dan "
  if [[ $val =~ [[:space:]\#\$\"\'\\] ]]; then
    val=${val//\\/\\\\}; val=${val//\"/\\\"}; val=${val//\$/\\\$}; val="\"$val\""
  fi
  tmp=$(mktemp)
  KEY="$key" VAL="$val" awk '
    BEGIN { k=ENVIRON["KEY"]; v=ENVIRON["VAL"]; done=0 }
    $0 ~ "^#? *" k "=" { if (!done) { print k "=" v; done=1 }; next }
    { print }
    END { if (!done) print k "=" v }' .env > "$tmp"
  cat "$tmp" > .env; rm -f "$tmp"
}

PHP=${SETUP_PHP:-php}
COMPOSER_BIN=${SETUP_COMPOSER:-composer}

echo "== Setup backend Klinik Pondok Medika =="
"$PHP" -r 'exit(version_compare(PHP_VERSION, "8.2.0", ">=") ? 0 : 1);' \
  || { echo "PHP minimal 8.2 dibutuhkan (sekarang: $("$PHP" -r 'echo PHP_VERSION;')). Ubah di hPanel > PHP Configuration."; exit 1; }

ask API_DOMAIN   "Domain API"          "api.klinikpondokmedika.id"
ask FRONT_DOMAIN "Domain frontend"     "klinikpondokmedika.id"
ask DB_NAME      "Nama database MySQL"
ask DB_USER      "User database MySQL" "$DB_NAME"
ask_secret DB_PASS "Password database MySQL"
ask ADMIN_EMAIL  "Email login admin"   "admin@$FRONT_DOMAIN"
ask_secret ADMIN_PASS "Password admin (min. 8 karakter)"
while [ ${#ADMIN_PASS} -lt 8 ]; do echo "  Minimal 8 karakter."; ask_secret ADMIN_PASS "Password admin (min. 8 karakter)"; done

echo; echo "== 1/5 Install dependensi PHP =="
# --no-scripts: Hostinger mematikan proc_open, sehingga Composer tidak bisa menjalankan
# script artisan sendiri. package:discover dijalankan langsung di bawah.
"$COMPOSER_BIN" install --no-dev --optimize-autoloader --no-interaction --no-scripts --prefer-dist
"$PHP" artisan package:discover --ansi

echo; echo "== 2/5 Menulis .env =="
if [ -f .env ]; then cp .env ".env.backup-$(date +%Y%m%d%H%M%S)"; echo "  .env lama dicadangkan."
else cp .env.example .env; fi
set_env APP_NAME "Klinik Pondok Medika"
set_env APP_ENV production
set_env APP_DEBUG false
set_env APP_URL "https://$API_DOMAIN"
set_env APP_LOCALE id
set_env APP_FALLBACK_LOCALE id
set_env FRONTEND_URL "https://$FRONT_DOMAIN"
set_env CORS_ALLOWED_ORIGINS "https://$FRONT_DOMAIN,https://www.$FRONT_DOMAIN"
set_env SANCTUM_EXPIRATION 720
set_env LOG_LEVEL error
set_env DB_CONNECTION "${SETUP_DB_CONNECTION:-mysql}"
set_env DB_HOST "${SETUP_DB_HOST:-localhost}"
set_env DB_PORT 3306
set_env DB_DATABASE "$DB_NAME"
set_env DB_USERNAME "$DB_USER"
set_env DB_PASSWORD "$DB_PASS"
set_env QUEUE_CONNECTION sync
chmod 600 .env
grep -q '^APP_KEY=base64:' .env || "$PHP" artisan key:generate --force

echo; echo "== 3/5 Membuat tabel database =="
"$PHP" artisan config:clear >/dev/null
"$PHP" artisan migrate --force
if [ ! -e public/storage ]; then
  "$PHP" artisan storage:link >/dev/null 2>&1 || true
  # fallback jika fungsi symlink() PHP dimatikan
  [ -e public/storage ] || ln -s ../storage/app/public public/storage
fi
[ -e public/storage ] && echo "  public/storage -> storage/app/public OK"

echo; echo "== 4/5 Membuat akun admin =="
ADMIN_PASSWORD="$ADMIN_PASS" "$PHP" artisan admin:create "$ADMIN_EMAIL"

echo; echo "== 5/5 Optimasi =="
"$PHP" artisan config:cache
"$PHP" artisan route:cache
chmod -R ug+rwX storage bootstrap/cache

cat <<EOF

Selesai. Langkah terakhir: arahkan subdomain ke folder public (lihat DEPLOY.md bagian 2), misalnya:

  rm -rf ~/domains/$FRONT_DOMAIN/public_html/api
  ln -s $BACKEND_DIR/public ~/domains/$FRONT_DOMAIN/public_html/api

Lalu cek https://$API_DOMAIN/up dan https://$API_DOMAIN/api/facilities
EOF
