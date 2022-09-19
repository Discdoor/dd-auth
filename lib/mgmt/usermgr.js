const { Db } = require("mongodb");

/**
 * Management object for users.
 */
class UserManager {
    /**
     * Constructs a new user manager.
     * @param {Db} db The database to use.
     */
    constructor(db) {
        this.colUsers = db.collection('users');
    }

    /**
     * 
     */
    async getUserById() {

    }
}