const Card = require('../../Card.js');

class Slayer extends Card {
    // If there are no enemy creatures in play, destroy Slayer.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.terminalCondition({
                condition: (context) =>
                    !context.source.controller.opponent ||
                    context.source.controller.opponent.creaturesInPlay.length === 0,
                message: '{0} is destroyed as there are no enemy creatures',
                gameAction: ability.actions.destroy()
            })
        });
    }
}

Slayer.id = 'slayer';

module.exports = Slayer;
