FROM node:20-alpine

WORKDIR /app

ADD package*.json ./

COPY . .

EXPOSE 3004

ENTRYPOINT [ "sh", "-c", "npm run start" ]

