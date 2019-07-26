FROM node:latest
RUN mkdir -p /usr/src/lobby
WORKDIR /usr/src/lobby
COPY package.json /usr/src/lobby/
COPY package-lock.json /usr/src/lobby/
RUN npm install
COPY . /usr/src/lobby
EXPOSE 4000

CMD [ "npm", "start" ]