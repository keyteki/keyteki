const Card = require('../../Card.js');
const EventRegistrar = require('../../eventregistrar.js');

class TheEndIsNigh extends Card {
    // During your opponent's turn, after 3 or more creatures have been destroyed that turn, fulfill The End is Nigh.
    setupCardAbilities(ability) {
        this.creaturesDestroyed = [];

        this.tracker = new EventRegistrar(this.game, this);
        this.tracker.register(['onTurnEnded', 'onCardDestroyed']);

        this.prophecyReaction({
            when: {
                onCardDestroyed: (event) =>
                    this.creaturesDestroyed.length >= 3 &&
                    this.creaturesDestroyed[2] === event.card.uuid
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }

    onTurnEnded() {
        this.creaturesDestroyed = [];
    }

    onCardDestroyed(event) {
        if (event.clone.type === 'creature') {
            this.creaturesDestroyed.push(event.card.uuid);
        }
    }
}

TheEndIsNigh.id = 'the-end-is-nigh';

module.exports = TheEndIsNigh;
