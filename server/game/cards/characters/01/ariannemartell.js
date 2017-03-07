const DrawCard = require('../../../drawcard.js');

class ArianneMartell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put a card with printed cost of 5 or lower in play',
            method: 'putInPlay',
            limit: ability.limit.perPhase(1)
        });
    }

    putInPlay(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select character',
            source: this,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });

        return true;
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.location === 'hand' && card.getCost() <= 5;
    }

    onCardSelected(player, card) {
        player.putIntoPlay(card);
        player.moveCard(this, 'hand');

        this.game.addMessage('{0} uses {1} to put {2} in play from their hand and return {1} to their hand', player, this, card);

        return true;
    }
}

ArianneMartell.code = '01104';

module.exports = ArianneMartell;
