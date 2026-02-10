#!/bin/sh
set -eu

DB_PATH="${DB_PATH:-/app/data/vertikal.db}"
BACKUP_DIR="${BACKUP_DIR:-/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
TS="$(date +%Y-%m-%d_%H-%M)"
BACKUP_FILE="$BACKUP_DIR/vertikal-$TS.db"

mkdir -p "$BACKUP_DIR"

if [ ! -f "$DB_PATH" ]; then
  echo "ERROR: Database not found at $DB_PATH"
  exit 1
fi

echo "Creating backup: $BACKUP_FILE"
sqlite3 "$DB_PATH" ".backup '$BACKUP_FILE'"

echo "Verifying integrity..."
RESULT="$(sqlite3 "$BACKUP_FILE" "PRAGMA integrity_check;")"
if [ "$RESULT" != "ok" ]; then
  echo "ERROR: Integrity check failed: $RESULT"
  rm -f "$BACKUP_FILE"
  exit 1
fi

SIZE="$(du -h "$BACKUP_FILE" | cut -f1)"
echo "Backup size: $SIZE"

echo "Rotating backups (keeping last $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -type f -name "vertikal-*.db" -mtime +"$RETENTION_DAYS" -delete

echo "OK — backup completed: $BACKUP_FILE"
