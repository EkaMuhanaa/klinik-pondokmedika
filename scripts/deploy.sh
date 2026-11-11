#!/usr/bin/env bash
# Deploy website lewat SSH di server Hostinger (tanpa File Manager):
#   bash ~/klinik-pondokmedika/scripts/deploy.sh
#
# 1. ambil kode terbaru dari GitHub (branch main)
# 2. update backend: dependensi, migrasi database, cache
# 3. unduh hasil build frontend dari GitHub Release "frontend-latest"
#    (dibuat workflow "Build frontend"), cek versinya sama dengan kode backend
# 4. pasang frontend ke public_html tanpa menyentuh symlink api
#
# Opsi: --skip-frontend  hanya update backend
#       --force          pasang frontend walau versinya berbeda dengan backend
set -euo pipefail

REPO_DIR="${REPO_DIR:-$HOME/klinik-pondokmedika}"
BRANCH="${BRANCH:-main}"
GITHUB_REPO="${GITHUB_REPO:-EkaMuhanaa/klinik-pondokmedika}"
RELEASE_URL="${RELEASE_URL:-https://github.com/$GITHUB_REPO/releases/download/frontend-latest/frontend-release.tar.gz}"
ARCHIVE="$HOME/frontend-release.tar.gz"

SKIP_FRONTEND=0; FORCE=0
for arg in "$@"; do
  case "$arg" in
    --skip-frontend) SKIP_FRONTEND=1 ;;
    --force) FORCE=1 ;;
    *) echo "Opsi tidak dikenal: $arg"; exit 1 ;;
  esac
done

cd "$REPO_DIR"
git fetch --quiet origin "$BRANCH"
git checkout --quiet "$BRANCH"
git reset --quiet --hard "origin/$BRANCH"
COMMIT="$(git rev-parse HEAD)"

echo "=== 1/2 Backend"
bash "$REPO_DIR/scripts/server-update-backend.sh"

[ "$SKIP_FRONTEND" = 1 ] && { echo "Frontend dilewati (--skip-frontend)."; exit 0; }

echo "=== 2/2 Frontend"
curl -fsSL --retry 3 -o "$ARCHIVE" "$RELEASE_URL" || {
  echo "Gagal mengunduh hasil build frontend dari GitHub."
  echo "Cek tab Actions → 'Build frontend' sudah selesai (centang hijau), lalu ulangi."
  exit 1
}
BUILT="$(tar -xzOf "$ARCHIVE" ./build-info.json 2>/dev/null | sed -n 's/.*"commit":"\([0-9a-f]*\)".*/\1/p')"
if [ "$BUILT" != "$COMMIT" ] && [ "$FORCE" != 1 ]; then
  echo "Versi frontend (${BUILT:-tidak diketahui}) belum sama dengan kode backend ($COMMIT)."
  echo "Build di GitHub mungkin masih berjalan. Tunggu 2-3 menit lalu jalankan ulang perintah ini."
  echo "(Backend sudah diperbarui. Pakai --force untuk tetap memasang frontend versi tersebut.)"
  rm -f "$ARCHIVE"
  exit 1
fi
bash "$REPO_DIR/scripts/server-publish-frontend.sh" "$ARCHIVE"

echo
echo "Deploy selesai: ${COMMIT:0:7}. Buka website untuk mengecek."
