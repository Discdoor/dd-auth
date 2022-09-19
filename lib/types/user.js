const bcrypt = require('bcrypt');
const { Collection } = require('mongodb');
const cfg = require('../../data/config.json');
const { verifyStrgHashSalted, hashStrgSalted } = require('../util/crypt');
const { ensureAcknowledgement } = require('../util/misc');
const { RGX_HTTP_URL } = require('../util/regex');

/**
 * Represents a user.
 */
class User {
    /**
     * The ID of the user. Autogenerated by backend.
     * @type {String}
     */
    id;

    /**
     * Whether the user is a bot.
     * @param {Boolean}
     */
    bot = false;

    /**
     * The username of this user.
     * @type {String}
     */
    username = "Anonymous";

    /**
     * The discriminant for this user. Autogenerated.
     * @type {String}
     */
    discrim = "0000";

    /**
     * The email for this user.
     * @type {String}
     */
    email = null;

    /**
     * The phone number of this user.
     * @type {String}
     */
    phone = "00000000000";

    /**
     * The avatar URL of this user. By default, a random colored image is selected from our CDN.
     * @type {String}
     */
    avatarUrl = cfg.defaults.avatarUrl;
    /**
     * The hashed password of this user.
     * @type {String}
     */
    passwordHash;

    /**
     * The account verification status.
     *  - "VERIFIED_L1" specifies an account which has been verified with an email.
     *  - "VERIFIED_L2" specifies an account which has been verified with both an email and valid phone number.
     *  - "AWAIT_VERIF" specifies an account which has specified an email but their email has not been confirmed yet.
     *  - "UNVERIFIED" specifies an account which has not been verified. We clasify this as a new user.
     * @type {"VERIFIED_L1"|"VERIFIED_L2"|"AWAIT_VERIF"|"UNVERIFIED"}
     */
    verifStatus = "UNVERIFIED";

    /**
     * Account creation date.
     * @type {Date}
     */
    creationDate;

    /**
     * Account last login date.
     * @type {Date}
     */
    lastLoginDate;

    /**
     * Date of birth of the user. This is important for legal reasons, since the minimum age for using online services (such as this one) is usually 13.
     * @type {Date}
     */
    dateOfBirth;

    /**
     * Constructs a new user object.
     * @param {Collection} col The user collection.
     */
    constructor(col) {
        /* .. */
        this._col = col;
    }

    /**
     * Verifies the user password.
     * @param {String} password The password of the user to verify.
     */
    async verifyPassword(password) {
        if(this.passwordHash == null)
            throw new Error("Somehow, this user does not have a password.");

        return await verifyStrgHashSalted(password, this.passwordHash);
    }

    /**
     * Changes the password for this user account.
     * @param {String} password The new password to use.
     */
    async changePassword(password) {
        if((typeof password !== 'string') || (password.length > 320))
            throw new Error("Invalid password");

        const hash = await hashStrgSalted(password);
        ensureAcknowledgement(await this._col.updateOne({ id }, { $set: { passwordHash: hash }}));
        this.passwordHash = hash; // Reflect changes in local object
    }

    /**
     * Sets the avatar URL to the specified input.
     * @param {String} url The avatar URL to use.
     */
    async setAvatarUrl(url) {
        if((typeof url !== 'string') || (!RGX_HTTP_URL.test(url)))
            throw new Error("Invalid URL.");

        ensureAcknowledgement(await this._col.updateOne({ id }, { $set: { avatarUrl: url }}));
        this.avatarUrl = url;
    }
}

module.exports = User;