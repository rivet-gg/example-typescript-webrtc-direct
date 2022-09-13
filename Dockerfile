# === Build ===
FROM node:16-alpine as build
WORKDIR /app

RUN apk add --no-cache python3 make g++ && npm install -g node-pre-gyp

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build:server

# === Run ===
FROM node:16-alpine
WORKDIR /app

# See https://dustri.org/b/error-loading-shared-library-ld-linux-x86-64so2-on-alpine-linux.html
RUN ln -s /lib/libc.musl-x86_64.so.1 /lib/ld-linux-x86-64.so.2

COPY --from=build /app /app

CMD node dist/server/index.js

