const CardGameAction = require('./CardGameAction');

class DestroyAction extends CardGameAction {
    constructor(propertyFactory, isSacrifice = false) {
        super(propertyFactory);
        this.name = isSacrifice ? 'sacrifice' : 'destroy';
        this.effectMsg = isSacrifice ? 'sacrifice {0}' : 'destroy {0}';
    }

    setDefaultProperties() {
        this.purge = false;
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
        return super.createEvent('onCardDestroyed', params, event => {
            event.card.moribund = true;

            let leavesPlayEvent = super.createEvent('onCardLeavesPlay', {
                card: event.card,
                context: context,
                condition: event => event.card.location === 'play area',
                battlelineIndex: event.card.controller.creaturesInPlay.indexOf(event.card) - 1
            }, event => {
                if(context.game.firstDestroyEvent && !event.getSimultaneousEvents().includes(context.game.firstDestroyEvent)) {
                    context.game.firstDestroyEvent.addChildEvent(super.createEvent(
                        'unnamedEvent', {}, () => event.card.owner.moveCard(event.card, this.purge ? 'purged' : 'discard')
                    ));
                    event.sharesReactionWindowWith(context.game.firstDestroyEvent);
                } else {
                    event.card.owner.moveCard(event.card, this.purge ? 'purged' : 'discard');
                }
            });
            event.sharesReactionWindowWith(leavesPlayEvent);
            event.addNextEvent(leavesPlayEvent);

            if(!context.game.firstDestroyEvent) {
                context.game.firstDestroyEvent = leavesPlayEvent;
                if(event.damageEvent) {
                    leavesPlayEvent.sharesReactionWindowWith(event.damageEvent);
                }
            }
        });
    }
}

module.exports = DestroyAction;
