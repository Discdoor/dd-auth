/*
Authentication service source.
*/

const express = require('express');
const app = express();
const cfg = require('./data/config.json');
const User = require('./lib/types/user');
const { MongoClient } = require('mongodb');
const UserManager = require('./lib/mgmt/usermgr');
const dbClient = new MongoClient(cfg.db.url);

app.use(express.json());

// ++++++++++++++++++ END POINTS ++++++++++++++++++ //

/**
 * Registration endpoint - registers a user.
 */
app.post(`/auth/register`, (req, res)=>{
    
});

// ++++++++++++++++++++++++++++++++++++++++++++++++ //

/**
 * App entry point.
 */
async function main() {
    // Step 1: Connect to database
    console.log("Connecting to database...");

    try {
        await dbClient.connect();
        console.log("DB connection success!");
    } catch(e) {
        console.log("Error: Database connection failure, see exception below:");
        console.error(e);
        process.exit(1);
    }

    const umgr = await new UserManager(dbClient.db('discdoor'));
    console.log(await umgr.createUser("Abc@defg.com", "Abcdefg", "abcdefg", new Date()));

    // Step 2: Start HTTP server
    app.listen(cfg.http.port, async () => {
        console.log(`DiscDoor HTTP Auth service available at :${cfg.http.port}`);
    });    
}

main();