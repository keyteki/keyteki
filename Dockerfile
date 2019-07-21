FROM node:latest
RUN mkdir -p /usr/src/lobby
WORKDIR /usr/src/lobby
COPY package.json /usr/src/lobby/
RUN npm install
COPY . /usr/src/lobby
EXPOSE 4000
RUN npm run build-vendor-dev

CMD [ "npm", "start" ]