const DrawCard = require('../../drawcard.js');

class RadiantOrator extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Send a character home',
            condition: context => context.source.isParticipating() && context.player.opponent && (
                // My total glory
                context.player.cardsInPlay.reduce((myTotal, card) => myTotal + (card.isParticipating() && !card.bowed ? card.getGlory() : 0), 0) >
                // is greater than Opponents total glory
                context.player.opponent.cardsInPlay.reduce((oppTotal, card) => oppTotal + (card.isParticipating() && !card.bowed ? card.getGlory() : 0), 0)
            ),
            target: {
                cardType: 'character',
                controller: 'opponent',
                gameAction: ability.actions.sendHome()
            }
        });
    }
}

RadiantOrator.id = 'radiant-orator';

module.exports = RadiantOrator;
