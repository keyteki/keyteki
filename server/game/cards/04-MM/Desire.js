const Card = require('../../Card.js');

class Desire extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.modifyKeyCost(4)
        });

        this.reap({
            gameAction: ability.actions.forgeKey((context) => ({
                modifier: -context.player.creaturesInPlay.reduce(
                    (total, card) => total + (card.hasTrait('sin') ? 1 : 0),
                    0
                )
            }))
        });
    }
}

Desire.id = 'desire';

module.exports = Desire;
