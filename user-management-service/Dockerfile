FROM node:20-alpine

WORKDIR /app

ADD package*.json ./

COPY . .

EXPOSE 3003

ENTRYPOINT [ "sh", "-c", "npm run start" ]
