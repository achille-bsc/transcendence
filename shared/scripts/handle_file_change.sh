#!/bin/sh

CHANGED_FILE=$1

EXT=${CHANGED_FILE##*.}

case "$EXT" in
	tsx | ts )
		echo "Reacting to file $1 changing"
		npm run build;;
	* )
		echo "handle_file_change: unexpected file type"
		exit 1;;
esac