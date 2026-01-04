const AbilityContext = require('../AbilityContext');
const BaseAbility = require('../baseability.js');

class ReturnToHandFromDiscardAction extends BaseAbility {
    constructor(card) {
        super({});
        this.card = card;
        this.title = 'Return this card to hand';
    }

    createContext(player = this.card.controller) {
        return new AbilityContext({
            ability: this,
            game: this.card.game,
            player: player,
            source: this.card
        });
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements) {
        if (context.game.currentPhase !== 'main') {
            return 'phase';
        }

        return super.meetsRequirements(context, ignoredRequirements);
    }

    executeHandler(context) {
        context.game.actions.returnToHand({ location: 'discard' }).resolve(this.card, context);
        context.game.addMessage('{0} returns {1} to their hand', context.player, context.source);
    }

    isAction() {
        return true;
    }
}

module.exports = ReturnToHandFromDiscardAction;
