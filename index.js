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
const SessionManager = require('./lib/mgmt/sessionmgr');
const { constructResponseObject, sendResponseObject } = libdd.api;
const { validateSchema } = libdd.schema;
const morgan = require('morgan');

// Setup logger
app.use(morgan('dev'));

// Disable CORS since the auth server will be going thru the gateway anyway.
app.use(cors());

// App context
const appContext = {
    app,
    /** @type {UserManager} */
    userMgr: null,
    /** @type {SessionManager} */
    sessionMgr: null
};

const sessionVerifMiddleware = require('./lib/middleware/session-verif').init(appContext);

// ++++++++++++++++++ END POINTS ++++++++++++++++++ //
// Set a reasonable limit for the JSON body parser
app.use(express.json({limit: '10kb'}));

// --- Unprivileged routes ---
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
            dob: { type: "number" }
        }, req.body);

        const result = await appContext.userMgr.createUser(req.body.email, req.body.username, req.body.password, new Date(req.body.dob));
        
        // Create a session
        const session = await appContext.sessionMgr.createSession(result);
        sendResponseObject(res, 200, constructResponseObject(true, "", session));
    } catch(e) {
        sendResponseObject(res, 400, constructResponseObject(false, e.message || ""));
    }
});

/**
 * Login endpoint - log the user in.
 */
app.post('/login', async(req, res) => {
    try {
        // Check types
        validateSchema({
            email: { type: "string", regex: RGX_EMAIL },
            password: { type: "string", minLength: 2, maxLength: 64 }
        }, req.body);

        // Find user
        const user = await appContext.userMgr.getUserByEmail(req.body.email);

        if(!user)
            throw new Error("User not found.");

        // Check password
        const result = await user.verifyPassword(req.body.password);

        if(!result)
            throw new Error("Password does not match.");

        // Update login date
        await user.updateLoginDate();
        
        // Create a session
        const session = await appContext.sessionMgr.createSession(user);
        sendResponseObject(res, 200, constructResponseObject(true, "", session));
    } catch(e) {
        sendResponseObject(res, 400, constructResponseObject(false, e.message || ""));
    }
});

// --- Restricted (internal) routes ---
/**
 * User view state endpoint.
 */
 app.get("/user/:id/view", async(req, res) => {
    if(req.hostname !== cfg.http.restrict_hostname)
        return sendResponseObject(res, 403, constructResponseObject(false, "Access denied"));

    try {
        // Check types
        validateSchema({
            id: { type: "string" },
        }, req.params);

        // Get the user
        const user = await appContext.userMgr.getUserById(req.params.id);

        if(!user)
            throw new Error("User not found.");

        sendResponseObject(res, 200, constructResponseObject(true, "", user.createCacheView()));
    } catch(e) {
        sendResponseObject(res, 400, constructResponseObject(false, e.message || ""));
    }
});

// Add session verification middleware
app.use(sessionVerifMiddleware);

// --- Privileged routes ---
app.post("/session/validate", (req, res) => sendResponseObject(res, 200, constructResponseObject(true, "", req.session)));

/*
State endpoint - get the current user state.
*/
app.get("/user/@me", async(req, res) => {
    try {
        // Get the user
        const user = await appContext.userMgr.getUserById(req.session.id);

        if(!user)
            throw new Error("User not found.");

        sendResponseObject(res, 200, constructResponseObject(true, "", user.createSafeView()));
    } catch(e) {
        sendResponseObject(res, 400, constructResponseObject(false, e.message || ""));
    }
});

/*
Patch endpoint for user state change.
*/
app.patch("/user/@me", async(req, res) => {
    try {
        // Get the user
        // Validate the schema
        validateSchema({
            username: { type: "string", minLength: cfg.limits.username.minLen, maxLength: cfg.limits.username.maxLen, optional: true },
            email: { type: "string", regex: RGX_EMAIL, optional: true },
            password: { type: "string", maxLength: 64, optional: true }
        }, req.body);
        
        const user = await appContext.userMgr.getUserById(req.session.id);

        if(!user)
            throw new Error("User not found.");

        // Change the requested properties
        if(req.body.password != null)
            await user.changePassword(req.body.password);

        if(req.body.email != null)
            await user.changeEmail(req.body.email);

        if(req.body.username != null)
            await user.changeUsername(req.body.username);

        sendResponseObject(res, 200, constructResponseObject(true, "", user.createSafeView()));
    } catch(e) {
        sendResponseObject(res, 400, constructResponseObject(false, e.message || ""));
    }
});

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
    console.log(`Connecting to database at ${cfg.db.url}...`);

    try {
        await dbClient.connect();
        const db = dbClient.db(cfg.db.name);
        appContext.userMgr = new UserManager(db);
        appContext.sessionMgr = new SessionManager(db);
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