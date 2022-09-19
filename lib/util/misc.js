/*
Miscellaneous utilities.
*/

/**
 * Generates a random integer.
 * @param {Number} max The maximum value for the random integer.
 * @returns A random integer.
 */
const rand = (max) => Math.floor(Math.random() * max);

/**
 * Ensures a DB operation has been successfully acknowledged.
 * @param {*} op The operation to check for.
 */
const ensureAcknowledgement = (op) => {
    if(!op.acknowledged)
        throw new Error("DB failed to acknowledge request.");
}

module.exports = {
    rand,
    ensureAcknowledgement
}