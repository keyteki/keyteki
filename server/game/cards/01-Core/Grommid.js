const Card = require('../../Card.js');

class Grommid extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.playerCannot(
                'play',
                (context) => context.source.type === 'creature'
            )
        });

        this.reaction({
            when: {
                onDamageDealt: (event, context) =>
                    event.damageSource === context.source &&
                    event.destroyEvent &&
                    event.destroyEvent.resolved
            },
            gameAction: ability.actions.loseAmber()
        });
    }
}

Grommid.id = 'grommid';

module.exports = Grommid;
