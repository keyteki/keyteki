const CardGameAction = require('./CardGameAction');

class DiscardCardAction extends CardGameAction {
    setup() {
        super.setup();
        this.cost = 'discarding {0}';
    }

    setDefaultProperties() {
        this.chatMessage = true;
    }

    getEvent(card, context) {
        let location = card.location;
        return super.createEvent('onCardDiscarded', { card, context, location }, () => {
            if (card.location === 'hand') {
                context.game.cardDiscarded(card);
            }

            card.owner.moveCard(card, 'discard');
        });
    }

    getEventArray(context) {
        if (!this.target || this.target.length === 0) {
            return [];
        }

        const events = this.target
            .filter((target) => this.canAffect(target, context))
            .map((card) => this.getEvent(card, context));
        if (events.length > 0 && this.chatMessage) {
            context.game.addMessage(
                '{0} uses {1} to discard {2}',
                context.player,
                context.source,
                this.target
            );
        }
        return events;
    }
}

module.exports = DiscardCardAction;
