const _ = require('underscore');
const BaseCardSelector = require('./BaseCardSelector.js');

class RingSelector extends BaseCardSelector {
    constructor(properties) {
        super(properties);
        this.ringCondition = properties.ringCondition;
        this.gameAction = properties.gameAction;
    }

    hasEnoughTargets(context) {
        return _.any(context.game.rings, ring => this.ringCondition(ring));
    }

    defaultActivePromptTitle() {
        return 'Choose a ring';
    }

}

module.exports = RingSelector;
