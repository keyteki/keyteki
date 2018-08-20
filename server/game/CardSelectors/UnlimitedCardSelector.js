const BaseCardSelector = require('./BaseCardSelector.js');

class UnlimitedCardSelector extends BaseCardSelector {
    hasEnoughSelected() {
        return true;
    }

    hasReachedLimit() {
        return false;
    }
}

module.exports = UnlimitedCardSelector;
