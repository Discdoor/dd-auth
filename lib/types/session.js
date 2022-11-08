class Session {
    /**
     * The age of the token.
     * @type {Number}
     */
    expiry;

    /**
     * The associated user id.
     * @type {String}
     */
    user;

    /**
     * The session type.
     * @param {"USER"|"PLATFORM_ADMIN"}
     */
    type;

    /**
     * The session key.
     * @param {String}
     */
    key;
}

module.exports = Session;