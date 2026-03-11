FROM node:24-alpine

WORKDIR /app

ADD package*.json ./

RUN npm install

# COPY --from=shared_ressources ./scripts ./
COPY --from=shared_ressources ./scripts/entrypoint.sh ./
COPY . .

RUN chmod +x entrypoint.sh \
    && cd game && npm i && npm run build

EXPOSE 3000

# ENTRYPOINT [ "npm", "run", "dev" ]
ENTRYPOINT [ "sh", "entrypoint.sh" ]

CMD [ "npm", "run", "dev" ]
