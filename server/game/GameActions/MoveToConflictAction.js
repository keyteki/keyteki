const CardGameAction = require('./CardGameAction');

class MoveToConflictAction extends CardGameAction {
    setup() {
        this.name = 'moveToConflict';
        this.targetType = ['character'];
        this.effectMsg = 'move {0} into the conflict';
    }

    canAffect(card, context) {
        if(!super.canAffect(card, context)) {
            return false;
        }
        if(!context.game.currentConflict || card.isParticipating()) {
            return false;
        }
        if(card.controller.isAttackingPlayer()) {
            if(!card.canParticipateAsAttacker()) {
                return false;
            }
        } else if(!card.canParticipateAsDefender()) {
            return false;
        }
        return card.location === 'play area';
    }

    getEvent(card, context) {
        return super.createEvent('onMoveToConflict', { card: card, context: context }, () => {
            if(card.controller.isAttackingPlayer()) {
                context.game.currentConflict.addAttacker(card);
            } else {
                context.game.currentConflict.addDefender(card);
            }
        });
    }
}

module.exports = MoveToConflictAction;
