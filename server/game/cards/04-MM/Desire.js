const Card = require('../../Card.js');

class Desire extends Card {
    // Keys cost +4A.
    // Reap: Forge a key at current cost, reduced by 1A for each friendly Sin creature.
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
