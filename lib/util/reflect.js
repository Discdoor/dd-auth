/**
 * Assigns the properties of a partial object to the specified object.
 * @param {Object} obj The target object.
 * @param {Object} part The partial object.
 * @param {String[]} exclusions Key names to exclude.
 */
function assignProps(obj, part, exclusions = []) {
    const keys = Object.keys(obj);

    for(let key of keys)
        if((!exclusions.includes(key)) && (typeof part[key] !== 'undefined'))
            obj[key] = part[key];

    return obj;
}

module.exports = {
    assignProps
}