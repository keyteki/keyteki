const PlotCard = require('../../../plotcard.js');

class Reinforcements extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character from your hand or discard pile',
                    source: this,
                    cardCondition: card => this.cardCondition(card),
                    onSelect: (player, card) => this.onCardClicked(player, card)
                });
            }
        });
    }

    cardCondition(card) {
        var player = card.controller;
        return this.controller === player &&
            card.getCost() <= 5 &&
            card.getType() === 'character' &&
            (player.findCardByUuid(player.discardPile, card.uuid) || player.findCardByUuid(player.hand, card.uuid));
    }

    onCardClicked(player, card) {
        var hand = !!player.findCardByUuid(player.hand, card.uuid);

        this.game.addMessage('{0} uses {1} to put {2} into play from their {3}', player, this, card, hand ? 'hand' : 'discard pile');

        player.putIntoPlay(card);

        return true;
    }
}

Reinforcements.code = '01020';

module.exports = Reinforcements;
