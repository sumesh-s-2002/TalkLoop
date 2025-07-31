FROM node:20-slim as prod
WORKDIR /app
COPY package*.json .
RUN npm install

COPY . .
COPY wait-for-it.sh .
RUN chmod +x wait-for-it.sh

CMD [ "npm", "run", "dev"];
