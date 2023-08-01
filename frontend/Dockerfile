# Build stage
FROM node:18-alpine AS build

ARG GITHUB_TOKEN
ARG VITE_PORT=3000
ENV VITE_PORT=${VITE_PORT}
ENV API_URL=http://localhost:8000
WORKDIR /app

COPY .npmrc package.json package-lock.json static svelte.config.js vite.config.ts ./
COPY src ./src
COPY static ./static

RUN npm install --save-dev && \
    npm install -g serve && \
    npm run build && \
    rm -rf node_modules src static && \
    npm cache clean --force

CMD [ "sh", "-c", "serve -s -l ${VITE_PORT} build" ]
