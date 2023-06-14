const Card = require('../../Card.js');

class FangtoothCavern extends Card {
    // At the end of your turn, destroy the least powerful creature.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) => context.player === this.game.activePlayer
            },
            target: {
                mode: 'mostStat',
                cardType: 'creature',
                controller: 'any',
                numCards: 1,
                cardStat: (card) => -card.power,
                gameAction: ability.actions.destroy()
            }
        });
    }
}

FangtoothCavern.id = 'fangtooth-cavern';

module.exports = FangtoothCavern;
