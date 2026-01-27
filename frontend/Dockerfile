FROM node:24-alpine

WORKDIR /app

ADD package*.json ./

# The --legacy-peer-deps is to be removed later
RUN npm install --legacy-peer-deps

COPY --from=shared_ressources ./scripts ./scripts
COPY . .

EXPOSE 443

# this needs to remain TEMPORARY
EXPOSE 80

ENTRYPOINT [ "npm", "run", "dev" ]