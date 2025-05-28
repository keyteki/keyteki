const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class RackOfRedemption extends Card {
    // Each turn, after the first Mutant creature is destroyed, its owner gains 1A.
    setupCardAbilities(ability) {
        this.mutantDestroyed = undefined;
        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onBeginRound', 'onCardDestroyed']);

        this.reaction({
            when: {
                onCardDestroyed: (event) =>
                    event.card.type === 'creature' &&
                    event.card.hasTrait('mutant') &&
                    (this.mutantDestroyed === undefined || this.mutantDestroyed === event.card)
            },
            gameAction: ability.actions.gainAmber((context) => ({
                preEventHandler: (context) => {
                    if (this.mutantDestroyed === undefined) {
                        this.mutantDestroyed = context.event.card;
                    }
                },
                target: context.event.card.owner,
                amount:
                    this.mutantDestroyed === undefined ||
                    this.mutantDestroyed === context.event.card
                        ? 1
                        : 0
            }))
        });
    }

    onBeginRound() {
        this.mutantDestroyed = undefined;
    }

    // Track events from before this was put into play (without triggering manual ordering)
    onCardDestroyed(event) {
        if (
            this.location !== 'play area' &&
            this.mutantDestroyed === undefined &&
            event.card.type === 'creature' &&
            event.card.hasTrait('mutant')
        ) {
            this.mutantDestroyed = event.card;
        }
    }
}

RackOfRedemption.id = 'rack-of-redemption';

module.exports = RackOfRedemption;
