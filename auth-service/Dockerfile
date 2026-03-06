FROM node:20-alpine

WORKDIR /app

ADD package*.json ./

COPY --from=shared_ressources ./plugin ./plugin

RUN npm install

COPY . .

EXPOSE 3001

ENTRYPOINT [ "sh", "-c", "npm run start" ]
