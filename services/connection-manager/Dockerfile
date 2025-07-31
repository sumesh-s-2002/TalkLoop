FROM node:20-slim As prod
WORKDIR /app

ENV NODE_ENV=production \
    PORT=6000

COPY ./package* .
RUN npm ci

COPY . .

EXPOSE 6000
CMD ["npm", "run", "dev"]

