#!/bin/sh

set -e
set -o pipefail

MOUNT_POINT="/app/data"

if [ -z "$(ls -A $MOUNT_POINT)" ]; then
	echo "Populating avatar folder with default content."
	#############
else 
	echo "Avatar folder already populated."
fi

exec "$@"