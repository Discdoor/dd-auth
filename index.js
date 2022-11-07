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
const cors = require('cors');
const libdd = require('libdd-node');
const { constructResponseObject, sendResponseObject } = libdd.api;

// Set a reasonable limit for the JSON body parser
app.use(express.json({limit: '10kb'}));

// Disable CORS since the auth server will be going thru the gateway anyway.
app.use(cors());

// Vars
/** @type {UserManager} */
let userMgr;

// ++++++++++++++++++ END POINTS ++++++++++++++++++ //

/**
 * Registration endpoint - registers a user.
 */
app.post(`/register`, async(req, res)=>{
    res.contentType('json');

    try {
        // Check types
        if((typeof req.body === 'undefined') || (typeof req.body.dob !== 'number'))
            return sendResponseObject(res, 400, constructResponseObject(false, "Invalid data"));

        const result = await userMgr.createUser(req.body.email, req.body.username, req.body.password, new Date(req.body.dob));
        
        return sendResponseObject(res, 200, constructResponseObject(true, "", {
            username: result.username,
            discrim: result.discrim,
            email: result.email,
            verifStatus: result.verifStatus,
            avatarUrl: result.avatarUrl 
        }));
    } catch(e) {
        console.error(e);
        sendResponseObject(res, 400, constructResponseObject(false, e.message || ""));
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