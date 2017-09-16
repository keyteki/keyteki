
class Ring {
    constructor(element, type) {
        this.claimed = false;
        this.claimedBy = '';
        this.conflictType = type;
        this.element = element;
        this.fate = 0;

    }

    flipConflictType() {
        if(this.conflictType === 'military') {
            this.conflictType = 'political';
        } else {
            this.conflictType = 'military';
        }
    }

    getElement() {
        return this.element;
    }

    getFate() {
        return this.fate;
    }

    modifyFate(fate) {
        /**
         * @param  {integer} fate - the amount of fate to modify this card's fate total by
         */
        //var oldFate = this.fate;

        this.fate += fate;

        if(this.fate < 0) {
            this.fate = 0;
        }


        //this.game.raiseEvent('onRingFateChanged', { ring: this, fate: this.fate - oldFate });

    }

    claimRing(player) {
        this.claimed = true;
        this.claimedBy = player.name;
    }

    resetRing() {
        this.claimed = false;
        this.claimedBy = '';
    }

    getState() {

        let state = {
            claimed: this.claimed,
            claimedBy: this.claimedBy,
            conflictType: this.conflictType,
            element: this.element,
            fate: this.fate
        };

        return state;
    }

}

module.exports = Ring;
