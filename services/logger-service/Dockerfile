FROM node:20-slim As prod
WORKDIR /app

ENV NODE_ENV=production \
    PORT=9000

COPY ./package* .
RUN npm ci

COPY . .

EXPOSE 9000
CMD ["npm", "run", "dev"]

