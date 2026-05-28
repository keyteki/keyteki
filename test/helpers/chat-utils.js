/*
 * Shared helpers used by both the test harness (GameFlowWrapper /
 * IntegrationHelper) and the scenario runner. Keeping them in one place
 * prevents the two consumers from silently drifting apart.
 */

function cardCamel(card) {
    const split = card.id.split('-');
    for (let i = 1; i < split.length; i++) {
        split[i] = split[i].slice(0, 1).toUpperCase() + split[i].slice(1);
        // TODO Enable this and fix the tests it breaks
        // if (split[i].length === 1) {
        //     split[i] = split[i].toLowerCase();
        // }
    }
    return split.join('');
}

function getChatString(item) {
    if (Array.isArray(item)) {
        return item.map(getChatString).join('');
    } else if (item instanceof Object) {
        if (item.name) {
            return item.name;
        } else if (item.message) {
            return getChatString(item.message);
        }
    }
    return item;
}

module.exports = { cardCamel, getChatString };
