FROM node:22-alpine

# Create a group and user
RUN addgroup -S connector && adduser -S connector -G connector

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev --ignore-scripts

USER connector

COPY build/src ./src
COPY build/test ./test
COPY build/examples/generic-connector/src ./examples/generic-connector/src

CMD [ "node", "examples/generic-connector/src/app.js" ]
