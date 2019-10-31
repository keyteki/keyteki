const Card = require('../../Card.js');

class ShatteredThrone extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.type === 'creature',
            effect: ability.effects.gainAbility('reaction', {
                when: {
                    onDamageDealt: (event, context) => event.damageSource === context.source && event.destroyed
                },
                gameAction: ability.actions.capture()
            })
        });
    }
}

ShatteredThrone.id = 'shattered-throne';

module.exports = ShatteredThrone;
