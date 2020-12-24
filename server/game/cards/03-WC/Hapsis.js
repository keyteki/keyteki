const Card = require('../../Card.js');

class Hapsis extends Card {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) => {
                    return (
                        event.damageEvent &&
                        event.damageEvent.fightEvent &&
                        event.damageEvent.damageSource === context.source
                    );
                }
            },
            gameAction: [ability.actions.ward(), ability.actions.draw()]
        });
    }
}

Hapsis.id = 'hapsis';

module.exports = Hapsis;
