FROM node:20-alpine

WORKDIR /app

ADD package*.json ./

RUN npm install && mkdir -p avatars

COPY --from=shared_ressources ./plugin ./plugin

COPY . .

EXPOSE 3003

ENTRYPOINT [ "sh", "-c", "npm run dev" ]

# CMD ["sh", "-c", "npm run dev" ]