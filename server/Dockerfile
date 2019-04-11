FROM node:11.13.0-alpine
#Create app directory and use it as work directory
RUN mkdir -p /srv/app/server
WORKDIR /srv/app/server

COPY package.json /srv/app/server
COPY package-lock.json /srv/app/server

RUN npm install

COPY . /srv/app/server

EXPOSE 3355

CMD ["npm", "start"]