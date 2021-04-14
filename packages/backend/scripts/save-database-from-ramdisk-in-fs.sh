#!/bin/sh
# Don't forget to set this file executable with this command :
# chmod +x ./save-database-from-ramdisk-in-fs.sh
\cp -r /mnt/ramdisk/sqlite.db /home/pi/rpi-parking-doors/packages/backend/data/sqlite.db
