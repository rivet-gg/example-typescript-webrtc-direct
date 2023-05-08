# Need to use Ubuntu base in order for wrtc lib to work.

# === Build ===
FROM node:18 as build
WORKDIR /app

RUN npm install -g node-pre-gyp
RUN apt-get update -y && apt-get install -y build-essential

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build:server

# === Run ===
FROM node:18
WORKDIR /app

RUN apt-get update -y \
	&& apt-get install -y libasound2 coturn

COPY --from=build /app /app

CMD node dist/server/index.js

