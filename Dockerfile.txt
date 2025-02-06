FROM node:18-alpine

WORKDIR /opt/api

RUN apk update && apk add build-base git \
    && apk add --no-cache g++ cairo-dev jpeg-dev pango-dev giflib-dev \
    && apk add --update --repository http://dl-3.alpinelinux.org/alpine/edge/testing libmount ttf-dejavu ttf-droid ttf-freefont ttf-liberation fontconfig

COPY package*.json ./

RUN npm install
COPY . .

CMD ["node", "index.js"]
