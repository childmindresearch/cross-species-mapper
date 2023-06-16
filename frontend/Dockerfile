FROM node:16-alpine

WORKDIR /app

COPY package.json package.json

RUN npm install

COPY . .

RUN npm install && \
    npm install -g serve && \
    npm run build && \
    npm cache clean --force && \
    rm -rf src node_modules public

CMD [ "serve", "-s", "dist", "-n"]