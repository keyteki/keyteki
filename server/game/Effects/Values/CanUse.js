const ConditionValue = require('./ConditionValue');

class CanUse extends ConditionValue {
    constructor(condition, toFight = false, toReap = false) {
        super(condition);
        this.toFight = toFight;
        this.toReap = toReap;
    }

    getValue() {
        return this;
    }

    // For canUse effects (player-level), we check if a specific card can be used
    // The card to check is abilityContext.source (the card being used), not the target
    checkCondition(target, abilityContext, effectContext) {
        if (!this.condition) {
            return true;
        }
        if (!abilityContext) {
            return false;
        }

        if (this.toFight) {
            return (
                (abilityContext.ability.title === 'Fight with this creature' ||
                    abilityContext.ability.title === "Remove this creature's stun") &&
                this.condition(abilityContext.source, abilityContext, effectContext)
            );
        }

        if (this.toReap) {
            return (
                (abilityContext.ability.title === 'Reap with this creature' ||
                    abilityContext.ability.title === "Remove this creature's stun") &&
                this.condition(abilityContext.source, abilityContext, effectContext)
            );
        }

        return this.condition(abilityContext.source, abilityContext, effectContext);
    }
}

module.exports = CanUse;
