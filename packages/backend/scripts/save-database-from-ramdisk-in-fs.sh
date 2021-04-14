#!/bin/sh
# Don't forget to set this file executable with this command :
# chmod +x ./save-database-from-ramdisk-in-fs.sh
SQLITE_DATABASE_FS_PATH=/home/pi/database/sqlite.db
SQLITE_DATABASE_RAMDISK_PATH=/mnt/ramdisk/sqlite.db

mkdir -p /home/pi/database && \cp -r $SQLITE_DATABASE_RAMDISK_PATH $SQLITE_DATABASE_FS_PATH
