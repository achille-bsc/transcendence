FROM node:20-alpine

WORKDIR /app

ADD package*.json ./

COPY --from=shared_ressources ./plugin ./plugin
COPY --from=shared_ressources ./scripts/entrypoint.sh ./

# RUN npm install

COPY . .

RUN npm install && chmod +x entrypoint.sh

EXPOSE 3001

ENTRYPOINT [ "sh", "entrypoint.sh" ]

CMD [ "npm", "run", "start" ]
