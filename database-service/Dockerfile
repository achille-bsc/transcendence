FROM node:25-alpine

WORKDIR /app

ADD package*.json ./

RUN npm install

COPY --from=shared_ressources ./scripts ./scripts
COPY . .

EXPOSE 5000

ENTRYPOINT [ "sh", "-c", "npx prisma generate dev && npx prisma migrate dev && npm run start" ]