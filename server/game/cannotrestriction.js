class CannotRestriction {
    constructor(type, condition) {
        this.type = type;
        this.condition = condition;
    }

    isMatch(type, abilityContext) {
        return this.type === type && this.checkCondition(abilityContext);
    }

    checkCondition(context) {
        if(!this.condition) {
            return true;
        }

        return this.condition(context);
    }
}

module.exports = CannotRestriction;
