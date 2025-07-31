FROM node:20-slim As prod
WORKDIR /app

ENV NODE_ENV=development \
    PORT=5000

COPY ./package* .
RUN npm install

COPY . .
EXPOSE 5000
CMD ["node", "run", "dev"]