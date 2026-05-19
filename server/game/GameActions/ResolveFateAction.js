const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class ResolveFateAction extends CardGameAction {
    setup() {
        this.name = 'fate';
        this.targetType = ['creature', 'artifact', 'action', 'upgrade'];
        this.effectMsg = 'resolve the fate effect of {0}';
    }

    getEvent(card, context) {
        // Note: the "resolves the fate effect" message is emitted by
        // FulfillProphecyAction before the fate event is opened so that it
        // precedes any fate interrupt messages in the log.
        let fateEvent = super.createEvent(EVENTS.onFate, { card: card, context: context });

        fateEvent.addChildEvent(
            context.game.actions
                .moveCard({ card: card, destination: 'discard' })
                .getEvent(card, context)
        );

        return fateEvent;
    }
}

module.exports = ResolveFateAction;
