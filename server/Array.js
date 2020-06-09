function flatten(array) {
    return array.reduce((result, element) => {
        if (Array.isArray(element)) {
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

    for (let item of array) {
        if (filterFunc(item)) {
            matches.push(item);
        } else {
            remaining.push(item);
        }
    }

    return [matches, remaining];
}

function sortByComparison(transform) {
    return function (a, b) {
        let aValue = transform(a);
        let bValue = transform(b);

        if (aValue > bValue) {
            return 1;
        }

        if (aValue < bValue) {
            return -1;
        }

        return 0;
    };
}

// expand(3, 2) returns "($1, $2), ($3, $4), ($5, $6)"
function expand(rowCount, columnCount, startAt = 1) {
    let index = startAt;

    return Array(rowCount)
        .fill(0)
        .map(
            () =>
                `(${Array(columnCount)
                    .fill(0)
                    .map(() => `$${index++}`)
                    .join(', ')})`
        )
        .join(', ');
}

function sortBy(array, transform) {
    return [...array].sort(sortByComparison(transform));
}

module.exports = {
    flatten,
    flatMap,
    partition,
    sortBy,
    expand
};
