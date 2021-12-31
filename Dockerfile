FROM node:10
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
RUN apt-get update
RUN apt-get install libcairo2-dev libpango1.0-dev -y
RUN npm install --no-optional
COPY . /usr/src/app
