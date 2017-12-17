class ImmunityRestriction {
    constructor(condition) {
        this.condition = condition;
    }

    isMatch(type, abilityContext) {
        return (
            abilityContext &&
            abilityContext.stage !== 'cost' &&
            this.condition(abilityContext)
        );
    }
}

module.exports = ImmunityRestriction;
