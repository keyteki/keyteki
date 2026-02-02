FROM node:22.22.0

RUN npm install -g npm@11.8.0
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm ci

ARG VERSION
ENV VERSION ${VERSION}

ENV NODE_ENV production

COPY . /usr/src/app

RUN npm run build

CMD [ "node", "." ]
