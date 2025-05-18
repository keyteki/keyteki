const CardGameAction = require('./CardGameAction');

class ResolveFateAction extends CardGameAction {
    setup() {
        this.name = 'fate';
        this.targetType = ['creature', 'artifact', 'action', 'upgrade'];
        this.effectMsg = 'resolve the fate effect of {0}';
    }

    getEvent(card, context) {
        let fateEvent = super.createEvent('onFate', { card: card, context: context }, () => {});

        fateEvent.addChildEvent(
            context.game.actions
                .moveCard({ card: card, destination: 'discard' })
                .getEvent(card, context)
        );

        return fateEvent;
    }
}

module.exports = ResolveFateAction;
