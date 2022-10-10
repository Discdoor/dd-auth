# Use NODEJS
FROM node:16-bullseye

# Create app directory
WORKDIR /usr/src/auth
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8082
CMD [ "node", "index.js" ]