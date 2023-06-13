const Card = require('../../Card.js');

class OverlordGreking extends Card {
    // After an enemy creature is destroyed fighting Overlord Greking, put that creature into play under your control.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.destroyedFighting &&
                    event.card.location === 'discard' &&
                    event.damageEvent.damageSource === context.source
            },
            gameAction: [
                ability.actions.changeEvent((context) => ({
                    event: context.event.fightEvent,
                    cancel: context.event.fightEvent.attacker !== context.source
                })),
                ability.actions.putIntoPlay((context) => ({
                    target: context.event.card,
                    myControl: true
                }))
            ],
            effect: "put {1} into play under {2}'s control",
            effectArgs: (context) => [context.event.card, context.source.controller]
        });
    }
}

OverlordGreking.id = 'overlord-greking';

module.exports = OverlordGreking;
