/*
Authentication service source.
*/

const express = require('express');
const app = express();
const cfg = require('./data/config.json');
const { MongoClient } = require('mongodb');
const UserManager = require('./lib/mgmt/usermgr');
const dbClient = new MongoClient(cfg.db.url);
const cors = require('cors');
const libdd = require('libdd-node');
const { RGX_EMAIL } = require('./lib/util/regex');
const { constructResponseObject, sendResponseObject } = libdd.api;
const { validateSchema } = libdd.schema;

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
    try {
        // Check types
        validateSchema({
            username: { type: "string", minLength: cfg.limits.username.minLen, maxLength: cfg.limits.username.maxLen },
            email: { type: "string", regex: RGX_EMAIL },
            password: { type: "string", minLength: 2, maxLength: 64 }, // Reasonable limit
            dob: { type: "number", min: 0 }
        }, req.body);

        const result = await userMgr.createUser(req.body.email, req.body.username, req.body.password, new Date(req.body.dob));
        
        return sendResponseObject(res, 200, constructResponseObject(true, "", {
            username: result.username,
            discrim: result.discrim,
            email: result.email,
            verifStatus: result.verifStatus,
            avatarUrl: result.avatarUrl 
        }));
    } catch(e) {
        sendResponseObject(res, 400, constructResponseObject(false, e.message || ""));
    }
});

/**
 * Validation endpoint - validate the user login.
 */
app.post('/validate', async(req, res) => {
    try {
        // Check types
        validateSchema({
            email: { type: "string", regex: RGX_EMAIL },
            password: { type: "string", minLength: 2, maxLength: 64 }
        }, req.body);

        // Find user
        const user = await userMgr.getUserByEmail(req.body.email);

        if(!user)
            throw new Error("User not found.");

        // Check password
        const result = await user.verifyPassword(req.body.password);

        if(!result)
            throw new Error("Password does not match.");
        else
            sendResponseObject(res, 200, constructResponseObject(true, "", user.createSafeView()));
    } catch(e) {
        sendResponseObject(res, 400, constructResponseObject(false, e.message || ""));
    }
});

/*
State endpoint - get the current user state.
*/
app.get("/user/:userId", async(req, res) => {
    try {
        // Get the user
        validateSchema({
            userId: { type: "string" }
        }, req.params);
        
        const user = await userMgr.getUserById(req.params.userId);

        if(!user)
            throw new Error("User not found.");

        sendResponseObject(res, 200, constructResponseObject(true, "", user.createSafeView()));
    } catch(e) {
        sendResponseObject(res, 400, constructResponseObject(false, e.message || ""));
    }
})

// ++++++++++++++++++++++++++++++++++++++++++++++++ //

/** 
 * Error middleware.
 */
app.use((error, req, res, next) => {
    if(error) 
        sendResponseObject(res, 400, constructResponseObject(false, error.message || ""));
});

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