const DrawCard = require('../../../drawcard.js');

class GatesOfWinterfell extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel this card to reavel the top card of your deck',
            method: 'kneel',
            cost: ability.costs.kneelSelf(),
            phase: 'challenge'
        });
    }

    kneel(player) {
        var card = player.drawDeck.value()[0];

        var message = '{0} uses {1} to reveal {2} as the top card of their deck';
        if(card.isFaction('stark')) {
            player.drawCardsToHand(1);
            message += ' and draw it';
        }

        this.game.addMessage(message, player, this, card);
    }
}

GatesOfWinterfell.code = '01154';

module.exports = GatesOfWinterfell;
