const CardGameAction = require('./CardGameAction');

class LookAtAction extends CardGameAction {
    setup() {
        super.setup();
        this.name = 'lookAt';
        this.effectMsg = 'look at a facedown card';
    }

    canAffect(card, context) {
        let testLocations = ['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province','play area'];
        if(!card.facedown && testLocations.includes(card.location)) {
            return false;
        }
        return super.canAffect(card, context);
    }

    checkEventCondition() {
        return true;
    }

    getEventArray(context) {
        if(this.target.length === 0) {
            return [];
        }
        return [this.createEvent('onLookAtCards', { cards: this.target, context: context }, event => {
            context.game.addMessage('{0} reveals {1}', context.source, event.cards);
        })];
    }

    getEvent(card, context) {
        return super.createEvent('onLookAtCards', { card: card, context: context }, () => {
            context.game.addMessage('{0} reveals {1}', context.source, card);
        });
    }
}

module.exports = LookAtAction;
