FROM node:20-alpine

WORKDIR /app

ADD package*.json ./

COPY --from=shared_ressources ./plugin ./plugin

COPY . .

RUN npm install

EXPOSE 3001

ENTRYPOINT [ "sh", "-c", "npm run start" ]
