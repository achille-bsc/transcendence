FROM caddy:2.11-alpine

WORKDIR /app

COPY Caddyfile ./

RUN mkdir -p /var/caddy && touch /var/caddy/log

ENTRYPOINT [ "caddy", "run", "--config", "/app/Caddyfile", "--watch"]