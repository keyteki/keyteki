const CardGameAction = require('./CardGameAction');

class HonorAction extends CardGameAction {
    setup() {
        this.name = 'honor';
        this.targetType = ['character'];
        this.effectMsg = 'honor {0}',
        this.cost = 'honoring {0}';
    }

    canAffect(card, context) {
        if(card.location !== 'play area' || card.type !== 'character' || card.isHonored) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        return super.createEvent('onCardHonored', { card: card, context: context }, () => card.honor());
    }
}

module.exports = HonorAction;
