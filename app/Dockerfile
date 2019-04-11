FROM node:11.13.0-alpine AS builder
#Create app directory and use it as work directory
RUN mkdir -p /srv/app/ui

WORKDIR /srv/app/ui

COPY package.json /srv/app/ui
COPY yarn.lock /srv/app/ui

RUN yarn install

COPY . /srv/app/ui 

EXPOSE 3000

# start app
CMD ["npm", "start"]