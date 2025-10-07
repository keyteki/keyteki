import _ from 'underscore';
import BaseCardSelector from './BaseCardSelector.js';

class SelectSelector extends BaseCardSelector {
    constructor(properties) {
        super(properties);
        this.choices = properties.choices;
    }

    hasEnoughTargets(context) {
        return _.any(this.choices, (condition) => condition(context));
    }

    defaultActivePromptTitle() {
        return 'Select one';
    }
}

export default SelectSelector;
