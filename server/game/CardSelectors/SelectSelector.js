const BaseCardSelector = require('./BaseCardSelector.js');

class SelectSelector extends BaseCardSelector {
    constructor(properties) {
        super(properties);
        this.choices = properties.choices;
    }

    hasEnoughTargets(context) {
        return this.choices.some((condition) => condition(context));
    }

    defaultActivePromptTitle() {
        return 'Select one';
    }
}

module.exports = SelectSelector;
