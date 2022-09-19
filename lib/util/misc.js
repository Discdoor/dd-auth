/*
Miscellaneous utilities.
*/

/**
 * Generates a random integer.
 * @param {Number} max The maximum value for the random integer.
 * @returns A random integer.
 */
const rand = (max) => Math.floor(Math.random() * max);

module.exports = {
    rand
}