import BaseCardSelector from './BaseCardSelector.js';

class UnlimitedCardSelector extends BaseCardSelector {
    hasEnoughSelected() {
        return true;
    }

    hasReachedLimit() {
        return false;
    }

    hasEnoughTargets() {
        return true;
    }
}

export default UnlimitedCardSelector;
