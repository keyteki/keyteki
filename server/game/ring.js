
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

    claimRing(player) {
        this.claimed = true;
        this.claimedBy = player;
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
