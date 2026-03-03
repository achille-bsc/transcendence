FROM node:20-alpine

WORKDIR /app

ADD package*.json ./

COPY . .

EXPOSE 3001

ENTRYPOINT [ "sh", "-c", "npm run start" ]
