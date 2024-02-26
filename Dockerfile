FROM --platform=linux/amd64 node:16

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm install

ARG VERSION
ENV VERSION ${VERSION}

ENV NODE_ENV production

COPY . /usr/src/app

RUN npm run build

CMD [ "node", "." ]
