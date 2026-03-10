FROM node:20-alpine

WORKDIR /app

ADD package*.json ./
COPY --from=shared_ressources ./scripts/entrypoint.sh ./

# RUN chmod +x entrypoint.sh && npm install

COPY . .

EXPOSE 3000

# ENTRYPOINT [ "sh", "-c", "npm run dev" ]
ENTRYPOINT [ "sh", "-c", "sleep infinity" ]
# ENTRYPOINT [ "sh", "entrypoint.sh" ]

# CMD [ "npm", "run", "dev" ]