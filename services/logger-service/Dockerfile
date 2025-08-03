FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=development
ENV PORT=9000

COPY ./package*.json ./

RUN npm install

COPY . .

EXPOSE 9000

CMD ["npm", "run", "dev"]
