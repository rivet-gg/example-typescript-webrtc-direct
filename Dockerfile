# === Build ===
FROM node:16-alpine as build
WORKDIR /app

RUN apk add --no-cache python3 make g++ && npm install -g node-pre-gyp

COPY package.json package-lock.json ./
RUN npm install --only=prod

COPY . .
RUN npm run build:server

# === Run ===
FROM node:15-alpine
WORKDIR /app
COPY --from=build /app /app

ENV PORT=80
EXPOSE 80
CMD node dist/server/index.js

