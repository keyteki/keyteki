const Card = require('../../Card.js');

class FangtoothCavern extends Card {
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
