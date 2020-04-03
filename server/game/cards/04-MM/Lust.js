const Card = require('../../Card.js');

class Lust extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyKeyCost(4)
        });

        this.reap({
            gameAction: ability.actions.forgeKey(context => ({
                modifier: -(context.player.creaturesInPlay.reduce((total, card) => total + card.hasTrait('sin') ? 1 : 0, 0))
            }))
        });
    }
}

Lust.id = 'lust';

module.exports = Lust;
