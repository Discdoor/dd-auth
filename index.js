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

// Set a reasonable limit for the JSON body parser
app.use(express.json({limit: '10kb'}));

// Vars
/** @type {UserManager} */
let userMgr;

// ++++++++++++++++++ END POINTS ++++++++++++++++++ //

/**
 * Registration endpoint - registers a user.
 */
app.post(`/auth/register`, async(req, res)=>{
    res.contentType('json');

    try {
        // Check types
        if((typeof req.body === 'undefined') || (typeof req.body.dob !== 'number'))
            return res.sendStatus(400);

        const result = await userMgr.createUser(req.body.email, req.body.username, req.body.password, new Date(req.body.dob));

        res.end(JSON.stringify({
            username: result.username,
            discrim: result.discrim,
            email: result.email,
            verifStatus: result.verifStatus,
            avatarUrl: result.avatarUrl 
        }));
    } catch(e) {
        console.error(e);
        res.status(400);
        res.end(JSON.stringify({
            code: (e.code != null) ? e.code : -1,
            message: (e.message != null) ? e.message : e
        }));
    }
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
        const db = dbClient.db('discdoor');
        userMgr = new UserManager(db);
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