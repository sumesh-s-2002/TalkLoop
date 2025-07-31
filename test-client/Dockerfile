FROM node:20-slim AS test
WORKDIR /app

COPY package.* .
RUN npm install

COPY . .
CMD ["npm", "run", "dev"]

