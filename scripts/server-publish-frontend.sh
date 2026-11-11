#!/usr/bin/env bash
# Pasang hasil build frontend (arsip .tar.gz) ke public_html tanpa menyentuh symlink `api`.
# Dipakai GitHub Actions. Manual: bash server-publish-frontend.sh ~/frontend-release.tar.gz
set -euo pipefail

ARCHIVE="${1:-$HOME/frontend-release.tar.gz}"
REPO_DIR="${REPO_DIR:-$HOME/klinik-pondokmedika}"
PUBLIC_DIR="${PUBLIC_DIR:-$HOME/domains/klinikpondokmedika.id/public_html}"
STAGING="$(mktemp -d "${TMPDIR:-/tmp}/frontend-XXXXXX")"
trap 'rm -rf "$STAGING"' EXIT

[ -f "$ARCHIVE" ] || { echo "Arsip $ARCHIVE tidak ditemukan"; exit 1; }
tar -xzf "$ARCHIVE" -C "$STAGING"
[ -f "$STAGING/index.html" ] || { echo "Arsip tidak berisi index.html, dibatalkan"; exit 1; }
[ ! -e "$STAGING/api" ] || { echo "Arsip berisi folder api, dibatalkan agar backend tidak tertimpa"; exit 1; }

mkdir -p "$PUBLIC_DIR"
# Hapus file lama hasil build (assets, prerender, html), kecuali api dan folder milik server
find "$PUBLIC_DIR" -mindepth 1 -maxdepth 1 \
  ! -name api ! -name .well-known ! -name cgi-bin ! -name .user.ini \
  -exec rm -rf {} +
cp -a "$STAGING/." "$PUBLIC_DIR/"

# Pastikan backend tetap bisa diakses lewat /api
if [ ! -L "$PUBLIC_DIR/api" ]; then
  [ -e "$PUBLIC_DIR/api" ] && mv "$PUBLIC_DIR/api" "$HOME/api-folder-lama-$(date +%Y%m%d%H%M%S)"
  ln -s "$REPO_DIR/backend/public" "$PUBLIC_DIR/api"
  echo "Symlink api dibuat ulang."
fi

rm -f "$ARCHIVE"
echo "Frontend terpasang di $PUBLIC_DIR"
ls -la "$PUBLIC_DIR" | grep -E " api | index.html"
