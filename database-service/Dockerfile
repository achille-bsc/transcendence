FROM node:25-alpine

WORKDIR /app

ADD package*.json ./

RUN npm install \
    && apk update \
    && apk add --no-cache curl openssl 

COPY --from=shared_ressources ./plugin ./plugin
COPY --from=shared_ressources ./scripts/entrypoint.sh ./

RUN chmod +x entrypoint.sh

COPY . .

EXPOSE 5000

# ENTRYPOINT [ "sh", "-c", "npx prisma generate && npx prisma db push && npm run start" ]
ENTRYPOINT [ "sh", "entrypoint.sh" ]

CMD [ "sh", "-c", "npx prisma generate && npx prisma db push && npm run start" ]
