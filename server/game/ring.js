
class Ring {
    constructor(element, type) {
        this.claimed = false;
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

    getState() {

        let state = {
            claimed: this.claimed,
            conflictType: this.conflictType,
            element: this.element,
            fate: this.fate
        }

        return state;
    }

}

module.exports = Ring;