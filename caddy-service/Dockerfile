FROM caddy:2.11-alpine

WORKDIR /app

COPY Caddyfile ./

RUN mkdir -p /var/caddy && touch /var/caddy/log

 # caddy start ou caddy run? 
ENTRYPOINT [ "caddy", "run", "--watch"]