class BaseCardSelector {
    constructor(properties) {
        this.cardCondition = properties.cardCondition;
        this.cardType = properties.cardType;
        this.gameAction = properties.gameAction;
        this.optional = properties.optional;
        this.stage = properties.stage || 'effect';

        if(!Array.isArray(properties.cardType)) {
            this.cardType = [properties.cardType];
        }
    }

    canTarget(card, context, pretarget = false) {
        let abilityContext = context.game.getCurrentAbilityContext();
        if((!abilityContext.card || abilityContext.card !== context.source) && context.source) {
            abilityContext = { source: 'card', card: context.source, stage: this.stage };
        }
        if(pretarget && context.ability && !context.ability.canPayCostsForTarget(context, card)) {
            return false;
        }
        return (
            this.cardType.includes(card.getType()) &&
            this.cardCondition(card, context) &&
            card.allowGameAction(this.gameAction, abilityContext) &&
            card.allowGameAction('target', abilityContext)
        );
    }

    hasEnoughSelected(selectedCards) {
        return selectedCards.length > 0;
    }

    hasEnoughTargets(context, pretarget = false) {
        return (this.optional || context.game.allCards.any(card => this.canTarget(card, context, pretarget)));
    }

    defaultActivePromptTitle() {
        return 'Choose cards';
    }

    automaticFireOnSelect() {
        return false;
    }

    wouldExceedLimit(selectedCards, card) { // eslint-disable-line no-unused-vars
        return false;
    }

    hasReachedLimit(selectedCards) { // eslint-disable-line no-unused-vars
        return false;
    }
    
    hasExceededLimit(selectedCards) { // eslint-disable-line no-unused-vars
        return false;
    }

    formatSelectParam(cards) {
        return cards;
    }
}

module.exports = BaseCardSelector;
