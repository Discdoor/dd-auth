const { Db } = require("mongodb");
const cfg = require('../../data/config.json');

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

    
}

module.exports = SessionManager;