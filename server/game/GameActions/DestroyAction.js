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
        return super.createEvent('onCardMarkedForDestruction', { card, context, inFight: this.inFight }, event => {
            event.card.moribund = true;
            event.destroyEvent = context.game.getEvent('onCardDestroyed', {
                card: event.card,
                context: context,
                condition: event => event.card.location === 'play area',
                inFight: event.inFight,
                battlelineIndex: event.card.controller.creaturesInPlay.indexOf(event.card) - 1
            }, event => {
                //console.log(componentEvent.card.name);
                event.addSubEvent(context.game.getEvent('onCardLeavesPlay', {
                    card: event.card,
                    context: event.context,
                    battlelineIndex: event.card.controller.creaturesInPlay.indexOf(event.card) - 1
                }, event => {
                    event.card.owner.moveCard(event.card, this.purge ? 'purged' : 'discard');
                }));
            });
            event.addSubEvent(event.destroyEvent);
        });
    }
}

module.exports = DestroyAction;
