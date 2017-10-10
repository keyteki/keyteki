const BaseCardSelector = require('./BaseCardSelector.js');

class UnlimitedCardSelector extends BaseCardSelector {
    hasReachedLimit() {
        return false;
    }
}

module.exports = UnlimitedCardSelector;
