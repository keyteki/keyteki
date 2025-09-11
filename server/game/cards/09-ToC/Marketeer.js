const Card = require('../../Card.js');

class Marketeer extends Card {
    // While your blue key is forged, Marketeer gains, “Action: Gain
    // 2A. Destroy Marketeer.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.player.keys.blue,
            targetController: 'current',
            match: (card, context) => card === context.source,
            effect: ability.effects.gainAbility('action', {
                gameAction: [ability.actions.gainAmber({ amount: 2 }), ability.actions.destroy()]
            })
        });
    }
}

Marketeer.id = 'marketeer';

module.exports = Marketeer;
