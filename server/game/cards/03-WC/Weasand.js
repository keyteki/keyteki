const Card = require('../../Card.js');

class Weasand extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            condition: (context) => !!context.player.opponent,
            when: {
                onForgeKey: () => true
            },
            gameAction: ability.actions.gainAmber({ amount: 2 })
        });

        this.persistentEffect({
            effect: ability.effects.terminalCondition({
                condition: (context) => context.source.isOnFlank(),
                message: '{0} is destroyed because it is on a flank',
                gameAction: ability.actions.destroy()
            })
        });
    }
}

Weasand.id = 'weasand';

module.exports = Weasand;
