const Card = require('../../Card.js');

class Weasand extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            condition: context => !!context.player.opponent,
            when: {
                onForgeKey: () => true,
            },
            gameAction: ability.actions.gainAmber({ amount: 2 })
        });

        this.persistentEffect({
            match: this,
            effect: ability.effects.terminalCondition({
                condition: () => this.isOnFlank(),
                message: '{0} is destroyed because it is on a flank',
                target: this,
                gameAction: ability.actions.destroy()
            })
        });
    }
}

Weasand.id = 'weasand';

module.exports = Weasand;
