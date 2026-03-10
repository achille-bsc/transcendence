FROM node:20-alpine

WORKDIR /app

ADD package*.json ./
COPY --from=shared_ressources ./scripts/entrypoint.sh ./

RUN npm install && mkdir -p avatars && chmod +x entrypoint.sh

COPY --from=shared_ressources ./plugin ./plugin

COPY . .

EXPOSE 3003

# ENTRYPOINT [ "sh", "-c", "npm run start" ]

# CMD ["sh", "-c", "npm run dev" ]
ENTRYPOINT [ "sh", "entrypoint.sh" ]

CMD [ "npm", "run", "start" ]