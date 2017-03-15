const BaseAbility = require('./baseability.js');

class CustomPlayAction extends BaseAbility {
    constructor(properties) {
        super(properties);
        this.condition = properties.condition || (() => true);
        this.handler = properties.handler;
        this.title = properties.title;
    }

    meetsRequirements(context) {
        return this.condition(context);
    }

    executeHandler(context) {
        this.handler(context);
    }
}

module.exports = CustomPlayAction;
