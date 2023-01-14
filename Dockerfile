# Use NODEJS
FROM node:16

# Setup image
WORKDIR /usr/src/auth
COPY package*.json ./
COPY . ./
RUN npm install
EXPOSE 8082
CMD [ "npm", "run", "start" ]