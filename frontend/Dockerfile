FROM node:24-alpine

WORKDIR /app

ADD package*.json ./

RUN npm install

COPY --from=shared_ressources ./scripts ./scripts
COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "dev" ]