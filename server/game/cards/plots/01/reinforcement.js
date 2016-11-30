const PlotCard = require('../../../plotcard.js');

class Reinforcements extends PlotCard {
    onReveal(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character from your hand or discard pile',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => this.cardCondition(card),
            onSelect: (player, card) => this.onCardClicked(player, card)
        });

        return false;
    }

    cardCondition(card) {
        var player = card.owner;
        return this.owner === player &&
            card.getCost() <= 5 &&
            card.getType() === 'character' &&
            (player.findCardByUuid(player.discardPile, card.uuid) || player.findCardByUuid(player.hand, card.uuid));
    }

    onCardClicked(player, card) {
        if(!this.inPlay) {
            return false;
        }

        var hand = !!player.findCardByUuid(player.hand, card.uuid);

        this.game.addMessage('{0} uses {1} to put {2} into play from their {3}', player, this, card, hand ? 'hand' : 'discard pile');

        player.playCard(card.uuid, true, hand ? player.hand : player.discardPile);

        if(!hand) {
            player.discardPile = player.removeCardByUuid(player.discardPile, card.uuid);
        }

        return true;
    }
}

Reinforcements.code = '01020';

module.exports = Reinforcements;
