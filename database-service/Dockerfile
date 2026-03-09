FROM node:25-alpine

WORKDIR /app

ADD package*.json ./

RUN npm install && apk update && apk add --no-cache curl

COPY --from=shared_ressources ./scripts ./scripts
COPY . .

EXPOSE 5000

ENTRYPOINT [ "sh", "-c", "npx prisma generate && npx prisma db push && npm run start" ]
