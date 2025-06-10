const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class TheEndIsNigh extends Card {
    // During your opponent's turn, after 3 or more creatures have been destroyed that turn, fulfill The End is Nigh.
    setupCardAbilities(ability) {
        this.creaturesDestroyed = [];

        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onPhaseStarted']);

        this.prophecyInterrupt({
            when: {
                onCardDestroyed: (event) => {
                    if (
                        event.card.type === 'creature' &&
                        !this.creaturesDestroyed.includes(event.card) &&
                        !event.cancelled
                    ) {
                        this.creaturesDestroyed.push(event.card);
                    }
                    return this.creaturesDestroyed.length >= 3;
                }
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }

    onPhaseStarted(event) {
        if (event.phase === 'main') {
            this.creaturesDestroyed = [];
        }
    }
}

TheEndIsNigh.id = 'the-end-is-nigh';

module.exports = TheEndIsNigh;
