from node:8

WORKDIR /app

RUN npm install mocha \
 && npm install chai
COPY ./nodescript.js /app