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
 * Verifies a hash.
 * @param {String} input The input string to verify.
 * @param {String} inHash The hash to use.
 * @param {"bcrypt"} algo The algorithm to use.
 */
async function verifyStrgHashSalted(input, inHash, algo = "bcrypt") {
    const saltStr = getSaltStr();

    switch(algo) {
        default:
            throw new Error("Algorithm not implemented.")
        case "bcrypt":
            return await bcrypt.compare(saltStr + input, inHash);
    }
}

/**
 * Gets the salt string.
 */
const getSaltStr = () => cfg.crypto.params.salt.map(x => String.fromCharCode(x)).join('');

/**
 * Generates a token.
 * @param {Number} n The length of the token to generate.
 * @returns The generated token.
 */
const generateToken = (n) => crypto.randomBytes(n).toString('hex');

module.exports = {
    hashStrgSalted,
    verifyStrgHashSalted,
    getSaltStr,
    generateToken
}