const { sendResponseObject, constructResponseObject } = require('libdd-node/lib/api');
const { parseBearerToken } = require('../util/misc');

/**
 * Creates a session verifier middleware.
 * @param {{ app: import('express').Application, sessionMgr: import('../mgmt/sessionmgr') }} appContext The application context.
 */
async function init(appContext) {
    appContext.app.use(async(req, res, next) => {
        try {
            const token = parseBearerToken(req.headers.authorization);
            
            if(!token)
                throw new Error("Access denied: invalid token");

            // Fetch session
            const session = await appContext.sessionMgr.getSession(token);

            if(!session)
                throw new Error("Invalid session.");

            req.session = session;
            next();
        } catch(e) {
            sendResponseObject(res, 401, constructResponseObject(false, e.message || ""));
        }
    });
}

module.exports = { init }