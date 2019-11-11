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
        return !card.moribund && card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        const params = {
            card: card,
            context: context,
            inFight: this.inFight,
            isFullyResolved: event => !!event.destroyEvent && event.destroyEvent.isFullyResolved(event.destroyEvent)
        };
        return super.createEvent('onCardMarkedForDestruction', params, event => {
            event.card.moribund = true;
            event.destroyEvent = context.game.getEvent('onCardDestroyed', {
                card: event.card,
                context: context,
                condition: event => event.card.location === 'play area',
                isFullyResolved: event => !!event.leavesPlayEvent && event.leavesPlayEvent.isFullyResolved(event.leavesPlayEvent),
                inFight: event.inFight,
                battlelineIndex: event.card.controller.creaturesInPlay.indexOf(event.card) - 1
            }, event => {
                event.leavesPlayEvent = context.game.getEvent('onCardLeavesPlay', {
                    card: event.card,
                    context: event.context,
                    battlelineIndex: event.card.controller.creaturesInPlay.indexOf(event.card) - 1
                }, event => {
                    event.card.owner.moveCard(event.card, this.purge ? 'purged' : 'discard');
                });
                event.addSubEvent(event.leavesPlayEvent);
            });
            event.addSubEvent(event.destroyEvent);
        });
    }
}

module.exports = DestroyAction;
