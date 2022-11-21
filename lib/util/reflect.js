/**
 * Assigns the properties of a partial object to the specified object.
 * @param {Object} obj The target object.
 * @param {Object} part The partial object.
 * @param {String[]} exclusions Key names to exclude.
 */
function assignProps(obj, part, exclusions = []) {
    const keys = Object.keys(part);

    for(let key of keys)
        if((!key.startsWith("_")) && (!exclusions.includes(key)) && (typeof part[key] !== 'undefined'))
            obj[key] = part[key];

    return obj;
}

/**
 * Creates a shallow view of an object.
 * @param {*} obj The input object to filter.
 * @param {string[]} filter Items to filter out.
 */
function createShallowView(obj, filter = []) {
    const newObj = {};
    const objKeys = Object.keys(obj);

    for(let k of objKeys) {
        const prop = obj[k];

        if(k.startsWith("_") || filter.includes(k) || (typeof prop == 'function'))
            continue;

        newObj[k] = prop;
    }

    return newObj;
}

module.exports = {
    createShallowView,
    assignProps
}