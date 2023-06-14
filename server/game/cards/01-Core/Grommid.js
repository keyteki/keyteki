const Card = require('../../Card.js');

class Grommid extends Card {
    // You cannot play creatures.
    // After an enemy creature is destroyed fighting Grommid, your opponent loses 1A.
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
