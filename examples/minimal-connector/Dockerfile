# We use a multi-stage build to keep the final image as small as possible.

FROM node:22-slim AS build

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm ci --ignore-scripts
RUN npm run compile

# Now create the final image by copying just what we need

FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit-dev --ignore-scripts
COPY --from=build /usr/src/app/build ./build

RUN adduser connector
USER connector

CMD ["node", "build/src/index.js" ]
