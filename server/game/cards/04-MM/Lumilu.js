const Card = require('../../Card.js');

class Lumilu extends Card {
    // Reap: Gain 1A for each other friendly Beast creature.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.player.creaturesInPlay.filter(
                    (card) => card !== context.source && card.hasTrait('beast')
                ).length
            }))
        });
    }
}

Lumilu.id = 'lumilu';

module.exports = Lumilu;
