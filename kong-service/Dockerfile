FROM node:20-alpine

WORKDIR /app

ADD package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# ENTRYPOINT [ "sh", "-c", "npm run dev" ]
ENTRYPOINT [ "ash" ]