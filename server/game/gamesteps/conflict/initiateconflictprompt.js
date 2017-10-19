const _ = require('underscore');
const UiPrompt = require('../uiprompt.js');

const capitalize = {
    military: 'Military',
    political: 'Political',
    air: 'Air',
    water: 'Water',
    earth: 'Earth',
    fire: 'Fire',
    void: 'Void'
};

class InitiateConflictPrompt extends UiPrompt {
    constructor(game, conflict, choosingPlayer) {
        super(game);
        
        this.conflict = conflict;
        this.choosingPlayer = choosingPlayer;
        this.selectedDefenders = [];
        this.covertRemaining = false;
    }

    activeCondition(player) {
        return player === this.choosingPlayer;
    }

    activePrompt() {
        let buttons = [{ text: 'Pass Conflict', arg: 'pass' }];
        let menuTitle = '';
        let promptTitle = '';
        
        if(this.conflict.conflictRing === '') {
            menuTitle = 'Choose an elemental ring';
            promptTitle = 'Initiate Conflict';
        } else {
            promptTitle = capitalize[this.conflict.conflictType] + ' ' + capitalize[this.conflict.conflictRing] + ' Conflict';
            if(!this.conflict.conflictProvince && !this.conflict.isSinglePlayer) {
                menuTitle = 'Choose province to attack';
            } else if(this.conflict.attackers.length === 0) {
                menuTitle = 'Choose attackers';
            } else {
                if(this.covertRemaining) {
                    menuTitle = 'Choose defenders to Covert';
                } else {
                    this.conflict.calculateSkill();
                    menuTitle = capitalize[this.conflict.conflictType] + ' skill: '.concat(this.conflict.attackerSkill);
                }
                buttons.unshift({ text: 'Initiate Conflict', arg: 'done' });
            }
        }
        
        return {
            menuTitle: menuTitle,
            buttons: buttons,
            promptTitle: promptTitle
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to declare conflict' };
    }

    onCardClicked(player, card) {
        if(player !== this.choosingPlayer) {
            return false;
        }

        if(!this.checkCardCondition(card)) {
            return false;
        }

        return this.selectCard(card);

    }

    onRingClicked(player, ring) {
        if(player !== this.choosingPlayer) {
            return false;
        }

        var canInitiateThisConflictType = !player.conflicts.isAtMax(ring.conflictType);        
        var canInitiateOtherConflictType = !player.conflicts.isAtMax(ring.conflictType === 'military' ? 'political' : 'military');        

        if((this.conflict.conflictRing === ring.element && canInitiateOtherConflictType) ||
                (this.conflict.conflictRing !== ring.element && !canInitiateThisConflictType)) {
            this.game.flipRing(player, ring);
            _.each(this.conflict.attackers, card => {
                if(!card.canDeclareAsAttacker(ring.conflictType)) {
                    this.conflict.removeFromConflict(card);
                }
            });
        }

        this.conflict.conflictRing = ring.element;
        this.conflict.conflictType = ring.conflictType;
        this.conflict.calculateSkill();
        return true;
    }

    checkCardCondition(card) {
        if(card.isProvince && card.controller !== this.choosingPlayer && !card.isBroken) {
            if(!this.conflict.conflictProvince || card === this.conflict.conflictProvince) {
                return true;
            }
        } else if(card.type === 'character') {
            if(card.controller === this.choosingPlayer) {
                if(card.canDeclareAsAttacker(this.conflict.conflictType)) {
                    return true;
                }
            } else if(this.selectedDefenders.includes(card) || (card.canBeBypassedByCovert() && this.covertRemaining)) {
                return true;
            }
        }
        return false;
    }
    
    recalculateCovert() {
        let attackersWithCovert = _.size(_.filter(this.conflict.attackers, card => card.isCovert()));
        this.covertRemaining = attackersWithCovert > _.size(this.selectedDefenders);
    }

    selectCard(card) {
        if(card.isProvince) {
            if(this.conflict.conflictProvince) {
                this.conflict.conflictProvince.inConflict = false;
                this.conflict.conflictProvince = null;
            } else {
                this.conflict.conflictProvince = card;
                this.conflict.conflictProvince.inConflict = true;
            }
        } else if(card.type === 'character') {
            if(card.controller === this.choosingPlayer) {
                if(!this.conflict.attackers.includes(card)) {
                    this.conflict.addAttacker(card);
                } else if(!card.isCovert() || this.covertRemaining) {
                    this.conflict.removeFromConflict(card);
                }
            } else {
                if(!this.selectedDefenders.includes(card)) {
                    this.selectedDefenders.push(card);
                    card.covert = true;
                } else {
                    this.selectedDefenders = _.reject(this.selectedDefenders, c => c === card);
                    card.covert = false;
                }         
            }
            this.recalculateCovert();
        }

        return true;
    }

    onMenuCommand(player, arg) {
        if(player !== this.choosingPlayer) {
            return false;
        }

        this.complete();
        if(arg === 'done') {
            this.conflict.conflictDeclared = true;
        } else if(arg === 'pass') {
            this.conflict.passed = true;
            this.game.raiseEvent('onConflictPass', { conflict: this.conflict });
            this.game.queueSimpleStep(() => this.conflict.cancelConflict());
        }
    }
}

module.exports = InitiateConflictPrompt;
