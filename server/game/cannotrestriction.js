class CannotRestriction {
    constructor(type, condition) {
        this.type = type;
        this.condition = condition;
    }

    isMatch(type, card, abilityContext) {
        return this.type === type && this.checkCondition(card, abilityContext);
    }

    checkCondition(card, context) {
        if(!this.condition) {
            return true;
        }

        return this.condition(card, context);
    }
}

module.exports = CannotRestriction;
