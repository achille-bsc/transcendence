FROM node:25-alpine

WORKDIR /app

ADD package*.json ./

RUN npm install \
    # && apk update \
    # && apk add --no-cache curl openssl \
    # && mkdir -p cert \
    # && openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    #   -keyout cert/db.key \
    #   -out cert/db.crt \
    #   -subj "/CN=localhost"

COPY --from=shared_ressources . .
COPY . .

EXPOSE 5000

ENTRYPOINT [ "sh", "-c", "npx prisma generate && npx prisma db push && npm run start" ]