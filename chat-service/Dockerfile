FROM node:20-alpine

WORKDIR /app

ADD package*.json ./

RUN npm install

COPY --from=shared_ressources ./plugin ./plugin

COPY . .

EXPOSE 3004

# ###
ENTRYPOINT [ "sh", "-c", "npm run start" ]


