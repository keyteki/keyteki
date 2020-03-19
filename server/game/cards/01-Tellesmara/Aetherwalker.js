const Card = require('../../Card.js');

class Aetherwalker extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                // todo: OnAttack
                // When Aetherwalker attacks
            },
            gameAction: [
                ability.actions.draw(),
                ability.actions.discard(context => ({
                    target: context.player.hand
                }))
            ]
        });
    }
}

Aetherwalker.id = 'aetherwalker';

module.exports = Aetherwalker;
