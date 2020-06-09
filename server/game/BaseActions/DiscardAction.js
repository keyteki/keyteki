const AbilityContext = require('../AbilityContext');
const BaseAbility = require('../baseability.js');

class DiscardAction extends BaseAbility {
    constructor(card) {
        super({});
        this.card = card;
        this.title = 'Discard this card';
    }

    createContext(player = this.card.controller) {
        return new AbilityContext({
            ability: this,
            game: this.card.game,
            player: player,
            source: this.card
        });
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if (
            !context.ignoreHouse &&
            (!this.card.hasHouse(context.player.activeHouse) ||
                context.player.anyEffect('noActiveHouseForPlay'))
        ) {
            return 'house';
        } else if (
            !this.card.checkRestrictions('discard', context) ||
            !context.player.checkRestrictions('discard', context)
        ) {
            return 'cannotTrigger';
        } else if (
            !ignoredRequirements.includes('location') &&
            !context.player.isCardInPlayableLocation(context.source, 'play')
        ) {
            return 'location';
        } else if (context.game.currentPhase !== 'main') {
            return 'phase';
        }

        return super.meetsRequirements(context);
    }

    executeHandler(context) {
        context.game.actions.discard().resolve(this.card, context);
        context.game.addMessage('{0} discards {1}', context.player, context.source);
    }

    isAction() {
        return true;
    }
}

module.exports = DiscardAction;
