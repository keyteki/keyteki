FROM node:22.22.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app

RUN npm ci

ARG VERSION
ARG SENTRY_DSN
ARG SENTRY_AUTH_TOKEN
ENV VERSION ${VERSION}
ENV VITE_VERSION ${VITE_VERSION}
ENV SENTRY_DSN ${SENTRY_DSN}
ENV VITE_SENTRY_DSN ${SENTRY_DSN}
ENV SENTRY_AUTH_TOKEN ${SENTRY_AUTH_TOKEN}

ENV NODE_ENV production

COPY . /usr/src/app

RUN npm run build

CMD [ "node", "." ]
