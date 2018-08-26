const CardGameAction = require('./CardGameAction');

class DestroyAction extends CardGameAction {
    constructor(propertyFactory, isSacrifice = false) {
        super(propertyFactory);
        this.name = isSacrifice ? 'sacrifice' : 'destroy';
        this.effectMsg = isSacrifice ? 'sacrifice {0}' : 'destroy {0}';
    }

    setDefaultProperties() {
        this.inFight = false;
    }

    setup() {
        this.targetType = ['creature', 'artifact', 'upgrade'];
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        let inFight = this.inFight;
        return super.createEvent('onCardDestroyed', { card, context, inFight }, () => {
            context.game.raiseEvent('onCardLeavesPlay', { card, context }, () => card.owner.moveCard(card, 'discard'));
        });
    }
}

module.exports = DestroyAction;
