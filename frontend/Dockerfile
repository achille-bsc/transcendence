FROM node:24-alpine

WORKDIR /app

ADD package*.json ./

# The --legacy-peer-deps is to be removed later
RUN npm install --legacy-peer-deps

COPY --from=shared_ressources ./scripts ./scripts
COPY . .

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "dev" ]