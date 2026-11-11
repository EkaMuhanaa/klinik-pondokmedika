#!/usr/bin/env bash
# Update backend Laravel di server Hostinger. Dipanggil oleh scripts/deploy.sh,
# atau dijalankan sendiri lewat SSH:
#   bash ~/klinik-pondokmedika/scripts/server-update-backend.sh
set -euo pipefail

REPO_DIR="${REPO_DIR:-$HOME/klinik-pondokmedika}"
BRANCH="${BRANCH:-main}"
PHP="${SETUP_PHP:-php}"
COMPOSER_BIN="${SETUP_COMPOSER:-composer}"

cd "$REPO_DIR"
echo "== Ambil kode terbaru ($BRANCH)"
git fetch --quiet origin "$BRANCH"
git checkout --quiet "$BRANCH"
git reset --quiet --hard "origin/$BRANCH"   # server tidak boleh punya perubahan lokal
git log --oneline -1

cd backend
echo "== Dependensi PHP"
# --no-scripts: Hostinger mematikan proc_open, package:discover dijalankan langsung
"$COMPOSER_BIN" install --no-dev --optimize-autoloader --no-interaction --no-scripts --prefer-dist --no-progress
"$PHP" artisan package:discover --ansi

echo "== Database"
"$PHP" artisan migrate --force

echo "== Cache konfigurasi & route"
"$PHP" artisan config:cache
"$PHP" artisan route:cache

if [ ! -e public/storage ]; then
  "$PHP" artisan storage:link >/dev/null 2>&1 || ln -s ../storage/app/public public/storage
fi
echo "Backend selesai diperbarui."
