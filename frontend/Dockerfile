FROM nikolaik/python-nodejs:python3.11-nodejs16

WORKDIR /app
EXPOSE 3000

COPY package.json package.json

RUN npm install

COPY . .

RUN npm install -g serve && \
    npm run build && \
    npm cache clean --force && \
    rm -rf src node_modules public

CMD [ "serve", "-s", "build", "-n"]