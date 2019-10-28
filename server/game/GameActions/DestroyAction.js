const CardGameAction = require('./CardGameAction');

class DestroyAction extends CardGameAction {
    constructor(propertyFactory, isSacrifice = false) {
        super(propertyFactory);
        this.name = isSacrifice ? 'sacrifice' : 'destroy';
        this.effectMsg = isSacrifice ? 'sacrifice {0}' : 'destroy {0}';
    }

    setDefaultProperties() {
        this.inFight = false;
        this.purge = false;
    }

    setup() {
        this.targetType = ['creature', 'artifact', 'upgrade'];
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEventArray(context) {
        const componentEvents = super.getEventArray(context);
        return componentEvents.concat(super.createEvent('unnamedEvent', { componentEvents, inFight: this.inFight }, event => {
            const componentEvents = event.componentEvents.filter(event => !event.cancelled);
            context.game.openEventWindow(componentEvents.map(componentEvent => super.createEvent('onCardDestroyed', { card: componentEvent.card, context: context, inFight: event.inFight }, event => {
                componentEvent.destroyEvent = event;
                context.game.raiseEvent('onCardLeavesPlay', { card: event.card, context: event.context }, event => {
                    console.info(event.card.name, 'leaving play');
                    event.card.owner.moveCard(event.card, this.purge ? 'purged' : 'discard');
                });
            })));
        }));
    }

    getEvent(card, context) {
        return super.createEvent('onCardMarkedForDestruction', { card, context }, event => {
            event.card.moribund = true;
        });
    }
}

module.exports = DestroyAction;
