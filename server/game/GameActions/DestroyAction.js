const CardGameAction = require('./CardGameAction');

class DestroyAction extends CardGameAction {
    constructor(propertyFactory, isSacrifice = false) {
        super(propertyFactory);
        this.name = isSacrifice ? 'sacrifice' : 'destroy';
        this.effectMsg = isSacrifice ? 'sacrifice {0}' : 'destroy {0}';
    }

    setDefaultProperties() {
        this.purge = false;
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
            damageEvent: this.damageEvent
        };
        return super.createEvent('onCardDestroyed', params, (event) => {
            event.card.moribund = true;

            event.leavesPlayEvent = context.game.getEvent(
                'onCardLeavesPlay',
                {
                    card: event.card,
                    context: context,
                    condition: (event) => event.card.location === 'play area',
                    triggeringEvent: event,
                    battlelineIndex: event.card.controller.creaturesInPlay.indexOf(event.card) - 1
                },
                (leavesPlayEvent) => {
                    if (context.game.firstDestroyEvent === leavesPlayEvent) {
                        context.game.firstDestroyEvent = null;
                    } else if (
                        !this.purge &&
                        context.game.firstDestroyEvent &&
                        !context.game.firstDestroyEvent.getChildEvents().includes(leavesPlayEvent)
                    ) {
                        let newDestroyEvent = super.createEvent(
                            'unnamedEvent',
                            {
                                card: event.card,
                                context: event.context,
                                damageEvent: event.damageEvent
                            },
                            (newEvent) => (newEvent.name = 'onCardDestroyed')
                        );
                        context.game.firstDestroyEvent.addChildEvent(newDestroyEvent);
                        context.game.firstDestroyEvent.addChildEvent(
                            context.game.getEvent(
                                'unnamedEvent',
                                {
                                    card: leavesPlayEvent.card,
                                    context: leavesPlayEvent.context,
                                    condition: (event) => event.card.location === 'play area',
                                    triggeringEvent: newDestroyEvent,
                                    battlelineIndex: leavesPlayEvent.battlelineIndex
                                },
                                (newEvent) => {
                                    newEvent.name = 'onCardLeavesPlay';
                                    newEvent.card.owner.moveCard(
                                        event.card,
                                        this.purge ? 'purged' : 'discard'
                                    );
                                }
                            )
                        );
                        return;
                    }

                    leavesPlayEvent.card.owner.moveCard(
                        event.card,
                        this.purge ? 'purged' : 'discard'
                    );
                }
            );

            event.addSubEvent(event.leavesPlayEvent);
            /*
            if(!context.game.firstDestroyEvent || context.game.firstDestroyEvent.getSimultaneousEvents().every(e => e.cancelled || e.resolved)) {
                context.game.firstDestroyEvent = event.leavesPlayEvent;
            }
            */
        });
    }
}

module.exports = DestroyAction;
