FROM node:10
RUN mkdir -p /usr/src/lobby
WORKDIR /usr/src/lobby
COPY package.json /usr/src/lobby/
COPY package-lock.json /usr/src/lobby/
RUN npm install --no-optional
COPY . /usr/src/lobby
EXPOSE 4000

CMD [ "npm", "start" ]
