#!/bin/sh

rm -f /app/certs/ca-bundle.crt
cat /app/certs/public/*.crt > /app/certs/ca-bundle.crt

exec "$@"