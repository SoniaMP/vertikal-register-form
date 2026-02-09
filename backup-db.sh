#!/bin/sh
set -eu

DB_PATH="/app/data/vertikal.db"
BACKUP_DIR="/app/data/backups"
TS="$(date +%F)"
BACKUP_FILE="$BACKUP_DIR/vertikal-$TS.db"

mkdir -p "$BACKUP_DIR"

if [ ! -f "$DB_PATH" ]; then
  echo "ERROR: No existe la DB en $DB_PATH"
  exit 1
fi

echo "Creando backup: $BACKUP_FILE"
sqlite3 "$DB_PATH" ".backup '$BACKUP_FILE'"

echo "Verificando integridad..."
sqlite3 "$BACKUP_FILE" "PRAGMA integrity_check;" | grep -q "ok"

echo "Rotando backups (7 días)..."
# borra backups de más de 7 días
find "$BACKUP_DIR" -type f -name "vertikal-*.db" -mtime +7 -delete

echo "OK"
