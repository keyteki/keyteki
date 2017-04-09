const _ = require('underscore');

const BaseStep = require('../basestep.js');

class FulfillMilitaryClaim extends BaseStep {
    constructor(game, player, claim) {
        super(game);
        this.player = player;
        this.claim = claim;
    }

    continue() {
        var promptMessage = 'Select ' + this.claim + ' ' + (this.claim > 1 ? 'characters' : 'character') + ' to fulfill military claim';
        this.game.promptForSelect(this.player, {
            numCards: this.claim,
            activePromptTitle: promptMessage,
            waitingPromptTitle: 'Waiting for opponent to fulfill military claim',
            cardCondition: card =>
                card.location === 'play area'
                && card.controller === this.player
                && card.getType() === 'character'
                && card.canBeKilled(),
            onSelect: (p, cards) => this.fulfillClaim(p, cards),
            onCancel: () => this.cancelClaim()
        });

        return true;
    }

    fulfillClaim(p, cards) {
        if(!_.isArray(cards)) {
            cards = [cards];
        }

        var charactersAvailable = this.player.cardsInPlay.filter(c => c.getType() === 'character').length;
        var maxAppliedClaim = Math.min(this.claim, charactersAvailable);

        if(cards.length < maxAppliedClaim) {
            return false;
        }

        this.game.addMessage('{0} chooses {1} for claim', this.player, cards);

        _.each(cards, card => {
            card.controller.killCharacter(card);
        });

        return true;
    }

    cancelClaim() {
        this.game.addMessage('{0} has cancelled claim effects', this.player);
    }
}

module.exports = FulfillMilitaryClaim;
