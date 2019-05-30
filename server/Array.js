function flatten(array) {
    return array.reduce((result, element) => {
        if(Array.isArray(element)) {
            return result.concat(flatten(element));
        }

        return result.concat(element);
    }, []);
}

function flatMap(array, mapFunc) {
    return flatten(array.map(mapFunc));
}

function partition(array, filterFunc) {
    let matches = [];
    let remaining = [];

    for(let item of array) {
        if(filterFunc(item)) {
            matches.push(item);
        } else {
            remaining.push(item);
        }
    }

    return [matches, remaining];
}

function sortByComparison(transform) {
    return function(a, b) {
        let aValue = transform(a);
        let bValue = transform(b);

        if(aValue > bValue) {
            return 1;
        }

        if(aValue < bValue) {
            return -1;
        }

        return 0;
    };
}

function sortBy(array, transform) {
    return [...array].sort(sortByComparison(transform));
}

module.exports = {
    flatten,
    flatMap,
    partition,
    sortBy
};
