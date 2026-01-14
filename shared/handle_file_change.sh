#!/bin/bash

CHANGED_FILE = $1

EXT = ${CHANGED_FILE##*.}

case "$EXT" in
	tsx | ts )
		npx tsx $CHANGED_FILE;;
	* )
		echo "handle_file_change: unexpected file type"
		exit 1;;
esac