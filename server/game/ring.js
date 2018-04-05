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
        this.effects = {};
        
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

    addEffect(effectType, effectFunc) {
        if(!this.effects[effectType]) {
            this.effects[effectType] = [];
        }
        this.effects[effectType].push(effectFunc);
    }

    removeEffect(effectType, effectFunc) {
        this.effects[effectType] = _.reject(this.effects[effectType], effect => effect === effectFunc);
    }

    isConsideredClaimed(player = null) {
        let check = player => (_.any(this.effects.considerAsClaimed, func => func(player)) || this.claimedBy === player.name);
        if(player) {
            return check(player);
        }
        return _.any(this.game.getPlayers(), player => check(player));
    }

    canDeclare(player) {
        return !_.any(this.effects.cannotDeclare, func => func(player)) && !this.claimed;
    }

    isUnclaimed() {
        return !this.contested && !this.claimed;
    }

    flipConflictType() {
        if(this.conflictType === 'military') {
            this.conflictType = 'political';
        } else {
            this.conflictType = 'military';
        }
    }

    getElements() {
        if(this.game.currentConflict && this.game.currentConflict.conflictRing === this.element) {
            return this.game.currentConflict.getElements();
        }
        return [this.element];
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
        this.fate += fate;

        if(this.fate < 0) {
            this.fate = 0;
        }
    }
    
    removeFate() {
        this.fate = 0;
    }

    claimRing(player) {
        this.claimed = true;
        this.claimedBy = player.name;
        //this.contested = false;  Ruling change means that the ring stays contested until the reaction window closes
    }

    resetRing() {
        this.claimed = false;
        this.claimedBy = '';
        this.contested = false;
    }
    
    getShortSummary() {
        return {
            id: this.element,
            label: this.element,
            name: this.element,
            type: 'ring',
            element: this.element,
            conflictType: this.conflictType
        };
    }

    getState(activePlayer) {

        let selectionState = {};

        if(activePlayer) {
            selectionState = activePlayer.getRingSelectionState(this);
        }
        
        let state = {
            claimed: this.claimed,
            claimedBy: this.claimedBy,
            conflictType: this.conflictType,
            contested: this.contested,
            element: this.element,
            fate: this.fate,
            menu: this.getMenu()
        };
        
        return _.extend(state, selectionState);
    }
}

module.exports = Ring;
