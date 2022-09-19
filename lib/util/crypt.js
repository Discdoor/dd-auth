const crypto = require('crypto');
const bcrypt = require('bcrypt');
const cfg = require('../../data/config.json');

/**
 * Hashes the specified string using the internally specified salt.
 * @param {String} input The input string to hash.
 * @param {"bcrypt"|"sha256"} algo The algorithm to use.
 */
async function hashStrgSalted(input, algo = "bcrypt") {
    const saltStr = getSaltStr();

    switch(algo) {
        default:
            throw new Error("Algorithm not implemented.")
        case "sha256":
            return crypto.createHash('sha256').update(saltStr + input).digest().toString('hex');
        case "bcrypt":
            return await bcrypt.hash(saltStr + input, cfg.crypto.params.rounds);
    }
}

/**
 * Gets the salt string.
 */
const getSaltStr = () => cfg.crypto.params.salt.map(x => String.fromCharCode(x)).join('');

module.exports = {
    hashStrgSalted,
    getSaltStr
}