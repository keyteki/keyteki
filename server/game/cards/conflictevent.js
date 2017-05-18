const DrawCard = require('../drawcard.js');

class ConflictEvent extends DrawCard {
    // event card that can only be played during a conflict

    constructor(owner, cardData, conflictType, participatingAs) {
        // - conflictType (optional): make the event playable only on a
        //   conflict of the given type
        //
        // - participatingAs (optional): make the event playable only when the
        //   event controller is participating as either 'attacker' or
        //   'defender'
        //
        super(owner, cardData);

        this.conflictType = conflictType;
        this.participatingAs = participatingAs;
    }

    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        var conflict = this.game.currentConflict;
        if(!conflict) {
            return false;
        }
        if(this.conflictType && conflict.conflictType !== this.conflictType) {
            return false;
        }
        if((this.participatingAs === 'attacker' && challenge.attackingPlayer !== this.controller) ||
           (this.participatingAs === 'defender' && challenge.defendingPlayer !== this.controller)) {
            return false;
        }

        return super.canPlay(player, card);
    }

}

module.exports = ConflictEvent;
