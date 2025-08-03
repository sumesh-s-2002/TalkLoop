FROM node:20-slim As prod
WORKDIR /app

ENV NODE_ENV=development \
    PORT=4000

COPY ./package* .
RUN npm install

COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]