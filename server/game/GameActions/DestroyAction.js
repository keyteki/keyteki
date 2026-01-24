const { EVENTS } = require('../Events/types');
const CardGameAction = require('./CardGameAction');

class DestroyAction extends CardGameAction {
    constructor(propertyFactory, isSacrifice = false) {
        super(propertyFactory);
        this.name = isSacrifice ? 'sacrifice' : 'destroy';
        this.effectMsg = isSacrifice ? 'sacrifice {0}' : 'destroy {0}';
    }

    setDefaultProperties() {
        this.damageEvent = null;
    }

    setup() {
        this.targetType = ['creature', 'artifact', 'upgrade'];
    }

    canAffect(card, context) {
        return !card.moribund && card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        const params = {
            card: card,
            context: context,
            damageEvent: this.damageEvent,
            isRedirected: this.damageEvent.isRedirected
        };
        return super.createEvent(EVENTS.onCardDestroyed, params, (event) => {
            event.card.moribund = true;

            event.leavesPlayEvent = context.game.getEvent(
                EVENTS.onCardLeavesPlay,
                {
                    card: event.card,
                    context: context,
                    condition: (event) => event.card.location === 'play area',
                    triggeringEvent: event,
                    battlelineIndex: event.card.controller.cardsInPlay.indexOf(event.card) - 1,
                    isRedirected: this.damageEvent ? this.damageEvent.isRedirected : false
                },
                (leavesPlayEvent) => {
                    leavesPlayEvent.card.owner.moveCard(event.card, 'discard');
                }
            );

            event.addSubEvent(event.leavesPlayEvent);
        });
    }
}

module.exports = DestroyAction;
