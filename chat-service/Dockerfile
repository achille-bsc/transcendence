FROM node:20-alpine

WORKDIR /app

ADD package*.json ./
COPY --from=shared_ressources ./scripts/* ./

RUN npm install && chmod +x entrypoint.sh && chmod +x handle_file_change.sh

COPY --from=shared_ressources ./plugin ./plugin

COPY . .

EXPOSE 3004

# ENTRYPOINT [ "sh", "-c", "npm run start" ]
ENTRYPOINT [ "sh", "entrypoint.sh" ]

CMD [ "npm", "run", "start" ]

