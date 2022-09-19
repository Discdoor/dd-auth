const { rand } = require("./misc")

/**
 * Generates a user discriminant.
 */
function generateDiscriminant() {
    let discrim = ``;
    const num = 1 + rand(9998); // Discriminant must only be from 1-9999
    const zeroesToPad = 4 - (num.toString()).length;

    for(let i = 0; i < zeroesToPad; i++)
        discrim += "0";

    return discrim + num;
}

module.exports = {
    generateDiscriminant
}