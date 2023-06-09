const Card = require('../../Card.js');

class DumaTheMartyr extends Card {
    // Destroyed: Fully heal each other friendly creature and draw 2cards.
    setupCardAbilities(ability) {
        this.destroyed({
            effect: 'fully heal each other friendly creature and draw 2 cards',
            gameAction: [
                ability.actions.draw({ amount: 2 }),
                ability.actions.heal((context) => ({
                    target: context.player.creaturesInPlay.filter(
                        (card) => card !== context.source
                    ),
                    fully: true
                }))
            ]
        });
    }
}

DumaTheMartyr.id = 'duma-the-martyr';

module.exports = DumaTheMartyr;
