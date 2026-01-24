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
        if (!abilityContext || !abilityContext.source) {
            return false;
        }

        // Use abilityContext.source as the card being checked (the card being used)
        const cardBeingUsed = abilityContext.source;
        const abilityTitle = abilityContext.ability?.title;

        if (this.toFight) {
            return (
                (abilityTitle === 'Fight with this creature' ||
                    abilityTitle === "Remove this creature's stun") &&
                this.condition(cardBeingUsed, abilityContext, effectContext)
            );
        }

        if (this.toReap) {
            return (
                (abilityTitle === 'Reap with this creature' ||
                    abilityTitle === "Remove this creature's stun") &&
                this.condition(cardBeingUsed, abilityContext, effectContext)
            );
        }

        return this.condition(cardBeingUsed, abilityContext, effectContext);
    }
}

module.exports = CanUse;
