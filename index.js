/*
Authentication service source.
*/

const express = require('express');
const app = express();
const cfg = require('./data/config.json');
const mongoose = require('mongoose');
const { hashStrgSalted, getSaltStr } = require('./lib/util/crypt');
const mgClient = new mongoose.Mongoose();

// App routes

/**
 * Registration endpoint - registers a user.
 */
app.get(`/auth/register`, (req, res)=>{
    
});

/**
 * App entry point.
 */
async function main() {
    // Step 1: Connect to database
    console.log("Connecting to database...");

    try {
        await mgClient.connect(cfg.db.url);
        console.log("DB connection success!");
    } catch(e) {
        console.log("Error: Database connection failure, see exception below:");
        console.error(e);
        process.exit(1);
    }

    // Step 2: Start HTTP server
    app.listen(cfg.http.port, async () => {
        console.log(`DiscDoor HTTP Auth service available at :${cfg.http.port}`);
    });    
}

main();