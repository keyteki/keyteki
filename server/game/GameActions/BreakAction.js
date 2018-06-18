const CardGameAction = require('./CardGameAction');

class BreakAction extends CardGameAction {
    setup() {
        this.name = 'break';
        this.targetType = ['province'];
        this.effectMsg = 'break {0}';
        this.cost = 'breaking {0}';
    }

    canAffect(card, context) {
        if(!card.isProvince || card.isBroken) {
            return false;
        }
        return super.canAffect(card, context);
    }

    getEvent(card, context) {
        let params = { conflict: context.game.currentConflict, card: card, context: context };
        return super.createEvent('onBreakProvince', params, () => card.breakProvince());
    }
}

module.exports = BreakAction;
