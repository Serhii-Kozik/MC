FROM node:11.13.0-alpine
#Create app directory and use it as work directory
RUN mkdir -p /srv/app/simulator
WORKDIR /srv/app/simulator

COPY package.json /srv/app/simulator
COPY package-lock.json /srv/app/simulator

RUN npm install

COPY . /srv/app/simulator

EXPOSE 3000

CMD ["npm", "start"]