function escapeRegex(regex) {
    return regex.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

module.exports = {
    escapeRegex: escapeRegex
};
