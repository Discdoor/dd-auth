const { Db } = require("mongodb");
const User = require("../types/user");
const config = require('../../data/config.json');
const { generateToken } = require("../util/crypt");

/**
 * Session entity.
 */
class Session {
    /**
     * The session key.
     * @type {string};
     */
    key;

    /**
     * The expiry date.
     * @type {number}
     */
    expiry;

    /**
     * Assigned user id.
     * @param {string}
     */
    id;
}

class SessionManager {
    /**
     * Constructs a new session manager.
     * @param {Db} db The database to use.
     */
    constructor(db) {
        this.colSessions = db.collection('sessions');
    }

    /**
     * Cleans up old session keys.
     * @param {User} user The user to cleanup old session keys for. 
     */
    async cleanupOldKeys(user) {
        /** @type {Session[]} */
        const sessions = await this.colSessions.find({ id: user.id }).toArray();

        for(let session of sessions)
            if(Date.now() > session.expiry)
                await this.colSessions.deleteOne({ key: session.key });
    }

    /**
     * Creates a new session for the specified user.
     * @param {User} user The user to create a session for. 
     * @returns {Promise<Session>}
     */
    async createSession(user) {
        if(!user)
            throw new Error("No user specified");

        // Clean old sessions
        await this.cleanupOldKeys(user);

        // Create session
        const session = {
            key: generateToken(32),
            expiry: Date.now() + config.session.maxAge,
            id: user.id
        };

        await this.colSessions.insertOne(session);
        return session;
    }

    /**
     * Validates the specified session.
     * @param {string} key The key to validate.
     */
    async validateSession(key) {
        if(!key)
            throw new Error("No session key specified");

        const session = await this.colSessions.findOne({ key });
        
        if((!session) || (Date.now() > session.expiry))
            return false;

        // Extend session if validation successful
        await this.colSessions.updateOne({ key }, { $set: { expiry: Date.now() + config.session.maxAge } });
        return true;
    }

    /**
     * Gets the specified key object.
     * @param {string} key The key of the object to retrieve.
     * @returns {Promise<Session>}
     */
    async getSession(key) {
        if(!key)
            throw new Error("No session key specified");

        const session = await this.colSessions.findOne({ key });
        
        // Ensure to remove key if not valid
        if((session != null) && (Date.now() > session.expiry)) {
            await this.colSessions.deleteOne({ key });
            return null;
        }

        return session;
    }
}

module.exports = SessionManager;