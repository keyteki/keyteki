const CardGameAction = require('./CardGameAction');
const EntersPlayEvent = require('../Events/EntersPlayEvent');

class PutIntoPlayAction extends CardGameAction {
    constructor(propertyFactory, intoConflict = true) {
        super(propertyFactory);
        this.intoConflict = intoConflict;
    }

    setDefaultProperties() {
        this.fate = 0;
    }

    setup() {
        this.name = this.intoConflict ? 'putIntoConflict' : 'putIntoPlay';
        this.targetType = ['character'];
        this.effectMsg = 'put {0} into play' + this.intoConflict ? ' in the conflict' : '';
        this.cost = 'putting {0} into play';
    }

    canAffect(card, context) {
        if(!context || !super.canAffect(card, context)) {
            return false;
        } else if(!context.player || card.anotherUniqueInPlay(context.player)) {
            return false;
        } else if(card.location === 'play area' || card.facedown) {
            return false;
        } else if(this.intoConflict) {
            // There is no current conflict, or no context (cards must be put into play by a player, not a framework event)
            if(!context.game.currentConflict) {
                return false;
            }
            // controller is attacking, and character can't attack, or controller is defending, and character can't defend
            if((context.player.isAttackingPlayer() && !card.canParticipateAsAttacker()) || 
                (context.player.isDefendingPlayer() && !card.canParticipateAsDefender())) {
                return false;
            }
            // card cannot participate in this conflict type
            if(card.hasDash(context.game.currentConflict.conflictType)) {
                return false;
            }
            if(!card.checkRestrictions('putIntoPlay', context)) {
                return false;
            }
        }
        return true;
    }

    getEventArray(context) {
        return super.getEventArray(context);
    }

    getEvent(card, context) {
        return new EntersPlayEvent({ intoConflict: this.intoConflict, context: context }, card, this.fate, this);
    }
}

module.exports = PutIntoPlayAction;
