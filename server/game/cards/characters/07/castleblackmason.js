const DrawCard = require('../../../drawcard.js');

class CastleBlackMason extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search top 10 cards for location or attachment',
            cost: ability.costs.kneelMultiple(2, card => card.getType() === 'character' && card.hasTrait('Builder')),
            limit: ability.limit.perRound(2),
            handler: context => {
                this.game.addMessage('{0} uses {1} to kneel {2} to search the top 10 cards of their deck for a location or attachment', this.controller, this, context.kneelingCostCards);
                this.game.promptForDeckSearch(this.controller, {
                    numCards: 10,
                    activePromptTitle: 'Select a card to add to your hand',
                    cardType: ['attachment', 'location'],
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} uses {1} to reveal {2} and add it to their hand', player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not use {1} to add a card to their hand', player, this);
    }
}

CastleBlackMason.code = '07009';

module.exports = CastleBlackMason;
