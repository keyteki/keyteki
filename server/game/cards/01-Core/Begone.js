const Card = require('../../Card.js');

class Begone extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'select',
                choices: {
                    'Destroy each Dis creature': ability.actions.destroy(context => ({ target: context.game.cardsInPlay.filter(card => card.hasHouse('dis')) })),
                    'Gain 1 amber': ability.actions.gainAmber()
                }
            }
        });
    }
}

Begone.id = 'begone'; // This is a guess at what the id might be - please check it!!!

module.exports = Begone;
