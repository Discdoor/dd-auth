# Discdoor Authentication Service

This is the repository for the Discdoor authentication service.

This service handles verification AND generation. It is recommended to run a cluster of dd-auth instances to achieve scalability, especially since the target algorithm is a strong cryptographic algorithm known as Bcrypt.

## Prerequisites
 - NodeJS v16 or newer
 - MongoDB server

## How to setup

1. Clone the project

2. Run `npm install` to install all required dependencies.

3. Update `data/config.json` with the correct database URL.

4. Run `node index.js` to start this service.

## Important!

Remember to CHANGE THE SALT! The default one provided here has only been provided for simplicity and testing, but please change it for production to avoid security issues.