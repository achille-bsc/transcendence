FROM node:25-alpine

WORKDIR /app

ADD package*.json ./

RUN npm install

COPY . .

ENV DATABASE_URL="file:./data/dev.db"

RUN npx prisma generate dev && npx prisma migrate dev

EXPOSE 5000

ENTRYPOINT [ "npm", "run", "start" ]