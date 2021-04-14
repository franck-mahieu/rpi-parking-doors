#!/bin/bash
# Don't forget to set this file executable with this command :
# chmod +x ./add-database-file-in-ramdisk.sh
\cp -r /home/pi/rpi-parking-doors/packages/backend/data/sqlite.db /mnt/ramdisk/sqlite.db
