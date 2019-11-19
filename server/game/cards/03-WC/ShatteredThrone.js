const Card = require('../../Card.js');

class ShatteredThrone extends Card {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onFight: () => true
            },
            gameAction: ability.actions.capture(context => ({ target: context.event.attacker }))
        });
    }
}

ShatteredThrone.id = 'shattered-throne';

module.exports = ShatteredThrone;
