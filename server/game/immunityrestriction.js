class ImmunityRestriction {
    constructor(cardCondition) {
        this.cardCondition = cardCondition;
    }

    isMatch(type, abilityContext) {
        return (
            abilityContext.stage === 'effect' &&
            abilityContext.card &&
            this.cardCondition(abilityContext.card)
        );
    }
}

module.exports = ImmunityRestriction;
