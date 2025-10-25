const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class RackOfRedemption extends Card {
    // Each turn, after the first Mutant creature is destroyed, its owner gains 1A.
    setupCardAbilities(ability) {
        this.mutantDestroyed = undefined;
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onTurnStart', 'onCardDestroyed']);

        this.reaction({
            when: {
                onCardDestroyed: (event) =>
                    event.clone.type === 'creature' &&
                    event.clone.hasTrait('mutant') &&
                    (this.mutantDestroyed === undefined || this.mutantDestroyed === event.clone)
            },
            gameAction: ability.actions.gainAmber((context) => ({
                preEventHandler: (context) => {
                    if (this.mutantDestroyed === undefined) {
                        this.mutantDestroyed = context.event.clone;
                    }
                },
                target: context.event.clone.owner,
                amount:
                    this.mutantDestroyed === undefined ||
                    this.mutantDestroyed === context.event.clone
                        ? 1
                        : 0
            }))
        });
    }

    onTurnStart() {
        this.mutantDestroyed = undefined;
    }

    // Track events from before this was put into play (without triggering manual ordering)
    onCardDestroyed(event) {
        if (
            this.location !== 'play area' &&
            this.mutantDestroyed === undefined &&
            event.clone.type === 'creature' &&
            event.clone.hasTrait('mutant')
        ) {
            this.mutantDestroyed = event.clone;
        }
    }
}

RackOfRedemption.id = 'rack-of-redemption';

module.exports = RackOfRedemption;
