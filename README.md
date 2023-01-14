# Discdoor Authentication Service

This is the repository for the Discdoor authentication service.

This service handles verification AND generation. It is recommended to run a cluster of `dd-auth` instances to achieve scalability, especially since the target algorithm is a strong cryptographic algorithm (Bcrypt) which has been known to be compute intensive.

## Prerequisites
 - NodeJS v16 or newer
 - MongoDB server
 - Docker (for containerized deployment)

## How to setup

1. Clone the project

2. Run `npm install` to install all required dependencies.

3. Create a `.env` file from the sample `.env.example` file. Ensure all details there (including the database URL) are correct.

## Running

### Development
To run a development server, execute the following commands.
- `npm run dev`

### Production (local)
Run `npm run start` to start this service.

### Production (dockerized, preferred)
Simply create an image from the Dockerfile included here.

To do this, run `docker build -t dd-auth .` in the repository root.

Then you can create a container based on this image.

Please note: You will have to forward the `data/` directory with docker.

## Testing
To run the unit tests for this project, run `npm test`. A successful pass is required before making any commits to this project.

## Important!

Remember to CHANGE THE SALT! The default one provided here has only been provided for simplicity and testing, but please change it for production to avoid security issues.