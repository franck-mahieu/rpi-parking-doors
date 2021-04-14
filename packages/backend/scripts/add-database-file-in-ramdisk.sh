#!/bin/bash
# Don't forget to set this file executable with this command :
# chmod +x ./add-database-file-in-ramdisk.sh
SQLITE_DATABASE_FS_PATH=/home/pi/database/sqlite.db
SQLITE_DATABASE_RAMDISK_PATH=/mnt/ramdisk/sqlite.db
SQLITE_DATABASE_REPOSITORY_PATH=/home/pi/rpi-parking-doors/packages/backend/data/sqlite.db

if [ -f $SQLITE_DATABASE_FS_PATH ]; then
  \cp -r $SQLITE_DATABASE_FS_PATH $SQLITE_DATABASE_RAMDISK_PATH
else
  \cp -r $SQLITE_DATABASE_REPOSITORY_PATH $SQLITE_DATABASE_RAMDISK_PATH
fi
