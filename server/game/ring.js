const _ = require('underscore');

class Ring {
    constructor(game, element, type) {
        this.game = game;
        this.claimed = false;
        this.claimedBy = '';
        this.conflictType = type;
        this.contested = false;
        this.element = element;
        this.fate = 0;
        
        this.menu = _([
            { command: 'flip', text: 'Flip' },
            { command: 'claim', text: 'Claim' },
            { command: 'contested', text: 'Switch this ring to contested' },
            { command: 'unclaimed', text: 'Set to unclaimed' },
            { command: 'addfate', text: 'Add 1 fate' },
            { command: 'remfate', text: 'Remove 1 fate' },
            { command: 'takefate', text: 'Take all fate' },
            { command: 'conflict', text: 'Initiate Conflict' }
        ]);

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

    getMenu() {
        var menu = [];

        if(this.menu.isEmpty() || !this.game.manualMode) { 
            return undefined;
        }
        
        menu.push({ command: 'click', text: 'Select Ring' });
        menu = menu.concat(this.menu.value());
        
        return menu;
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
    
    removeFate() {
        this.fate = 0;
    }

    claimRing(player) {
        this.claimed = true;
        this.claimedBy = player.name;
        this.contested = false;
    }

    resetRing() {
        this.claimed = false;
        this.claimedBy = '';
        this.contested = false;
    }

    getState() {

        let state = {
            claimed: this.claimed,
            claimedBy: this.claimedBy,
            conflictType: this.conflictType,
            contested: this.contested,
            element: this.element,
            fate: this.fate,
            menu: this.getMenu()
        };

        return state;
    }

}

module.exports = Ring;
