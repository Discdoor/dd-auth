const { Db } = require("mongodb");
const User = require("../types/user");
const { assignProps } = require('libdd-node').reflect;
const { RGX_EMAIL } = require("../util/regex");
const cfg = require('../../data/config.json');
const { generateDiscriminant } = require("../util/usrutils");
const { hashStrgSalted, verifyStrgHashSalted } = require("../util/crypt");

/**
 * User management object.
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
     * Gets a user by ID.
     * @param {String} id The user ID to query.
     * @return {Promise<User>}
     */
    async getUserById(id) {
        if(typeof id !== 'string')
            throw new Error("Invalid type for 'id'");

        const doc = await this.colUsers.findOne({ id });

        if(doc == null)
            return null;

        // Instantiate new user object and populate properties
        return assignProps(new User(this.colUsers), doc, ["_id"]);
    }

    /**
     * Gets a user by email.
     * @param {String} email The user email to query.
     * @return {Promise<User>}
     */
    async getUserByEmail(email) {
        if(typeof email !== 'string')
            throw new Error("Invalid type for 'email'");

        const doc = await this.colUsers.findOne({ email });

        if(doc == null)
            return null;

        // Instantiate new user object and populate properties
        return assignProps(new User(this.colUsers), doc, ["_id"]);;
    }

    /**
     * Gets a user by tag.
     * @param {string} userTag The user tag to use.
     */
    async getUserByTag(userTag) {
        if(typeof userTag !== 'string')
            throw new Error("Invalid user tag.");

        const ts = userTag.split('#');

        if(ts.length < 2)
            throw new Error("Malformed user tag.")

        const username = ts[0];
        const discrim = ts[1];
        const doc = await this.colUsers.findOne({ username, discrim });

        if(doc == null)
            return null;

        return assignProps(new User(this.colUsers), doc, ["_id"]);;
    }

    /**
     * Deletes the specified user.
     * @param {String} id The ID of the user to delete.
     */
    async deleteUser(id) {
        const userDoc = await this.colUsers.findOne({ id });

        if(userDoc == null)
            throw new Error("User not found.");

        const result = await this.colUsers.deleteOne(userDoc);

        if(!result.acknowledged)
            throw new Error("Failed to delete user.");
    }

    /**
     * Creates a new user.
     * @param {String} email The email for this user account.
     * @param {String} username The username for this account.
     * @param {String} password The password to use.
     * @param {Date} dob The date of birth. Cannot be null for legal reasons.
     * @returns {Promise<User>}
     */
    async createUser(email, username, password, dob) {
        // Step 1: check if inputs make sense
        if(typeof email !== 'string')
            throw new Error("Error: email must be a string.");

        if(typeof username !== 'string')
            throw new Error("Username must be a string.");

        if(typeof password !== 'string')
            throw new Error("Password must be a string.");

        if(!(dob instanceof Date))
            throw new Error("Date of birth must be a valid date object.");

        // Check whether the email address is valid.
        if((!RGX_EMAIL.test(email)) || (email.length > 320))
            throw new Error("Email is not valid.");

        // Check if email has been used before
        const prevUser = await this.colUsers.findOne({ email });
        
        if(prevUser)
            throw new Error("Email is already in use!");

        // Check for username
        if((username.length > cfg.limits.username.maxLen) || (username.length < cfg.limits.username.minLen))
            throw new Error("Username is not valid.");

        // Ensure password is not empty or a single character
        if(password.length < 2)
            throw new Error("Password cannot be empty.");

        // Step 2: Check if a discriminant maximum has been reached for the specified username
        const similarUsers = await this.colUsers.find({ username }).toArray();

        if(similarUsers.length >= 9999)
            throw new Error("Too many users have the specified username!");
         
        // Step 3: Generate a discriminant that has not been taken
        let discrim = generateDiscriminant();
        
        // Keep generating if the previously generated discriminant has been taken.
        while(similarUsers.find(x => x.discrim === discrim) != null)
            discrim = generateDiscriminant();

        // Step 4: Generate ID
        // Here we are keeping it simple - the "generated" IDs are just increments of already created user accounts
        // We still prepend the passage of time to ensure old IDs cannot be reused.
        const id = `${new Date().getTime() + (await this.colUsers.countDocuments() + 1)}`;

        // Step 5: Construct user object
        const user = assignProps(new User(this.colUsers), {
            discrim,
            id,
            username,
            passwordHash: await hashStrgSalted(password),
            creationDate: new Date(),
            dateOfBirth: dob,
            email,
            verifStatus: "AWAIT_VERIF"
        });

        const result = await this.colUsers.insertOne({ ... user, ... { _col: undefined } });

        if(!result.acknowledged)
            throw new Error("User could not be made: DB did not acknowledge write!");

        return user;
    }
}

module.exports = UserManager;