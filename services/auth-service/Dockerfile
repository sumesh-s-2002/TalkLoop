##################################
# Build stage
#############################

FROM node:20-bookworm AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

###########################
## production stage
###########################

FROM node:20-slim AS prod
ENV NODE_ENV=production \
    PORT=4000

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 4000
CMD ["node", "src/server.js"]


