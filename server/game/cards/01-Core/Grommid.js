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
                onCardDestroyed: (event, context) =>
                    event.destroyedFighting && event.damageEvent.damageSource === context.source
            },
            gameAction: ability.actions.loseAmber()
        });
    }
}

Grommid.id = 'grommid';

module.exports = Grommid;
