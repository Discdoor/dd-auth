const { Db } = require("mongodb");
const cfg = require('../../data/config.json');
const Session = require("../types/session");
const User = require("../types/user");

/**
 * An object to manage user sessions.
 */
class SessionManager {
    /**
     * Constructs a new user manager.
     * @param {Db} db The database to use.
     */
    constructor(db) {
        this.colSessions = db.collection('sessions');
    }

    /**
     * Gets the session by ID.
     * @param {String} id The ID of the session to retrieve.
     */
    async getSession(id) {
        return await this.colSessions.findOne({ id });
    }

    /**
     * Cleans old user sessions.
     * @param {User} user The user to cleanup sessions for.
     */
    async cleanupOldSessions(user) {
        if((user == null) || (user.id == null))
            throw new Error("User is not valid.");

        /** @type {Session[]} */
        const sessions = await this.colSessions.find({ user: user.id }).toArray();

        for(let sess of sessions)
            if(Date.now() > sess.expiry)
                await this.colSessions.deleteOne({ id: sess.key });
    }

    /**
     * Creates a session for the specified user.
     * @param {User} user The user to create the session for.
     */
    async createSession(user) {
        if((user == null) || (user.id == null))
            throw new Error("User is not valid.");

        // Purge old sessions
        await this.cleanupOldSessions(user);

        // Create new session
    }

    /**
     * Validates the session token. When successful, extend the session age by the config value.
     * @param {string} token The token to validate. 
     */
    async validateSession(token) {
        // Get session in database
        
        // Check age of token

        // Extend age of token if validation successful
    }
}

module.exports = SessionManager;