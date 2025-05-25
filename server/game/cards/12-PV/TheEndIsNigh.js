const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class TheEndIsNigh extends Card {
    // During your opponent's turn, after 3 or more creatures have been destroyed that turn, fulfill The End is Nigh.
    setupCardAbilities(ability) {
        this.creaturesDestroyed = 0;

        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onCardDestroyed', 'onPhaseStarted']);

        this.prophecyInterrupt({
            when: {
                onCardDestroyed: (event) =>
                    event.card.type === 'creature' && this.creaturesDestroyed >= 2
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }

    onCardDestroyed(event) {
        if (event.card.type === 'creature') {
            this.creaturesDestroyed += 1;
        }
    }

    onPhaseStarted(event) {
        if (event.phase === 'main') {
            this.creaturesDestroyed = 0;
        }
    }
}

TheEndIsNigh.id = 'the-end-is-nigh';

module.exports = TheEndIsNigh;
