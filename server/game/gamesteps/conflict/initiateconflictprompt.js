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
        this.selectedAttackers = [];
        this.selectedDefenders = [];
        this.selectedProvince = null;
        this.covertRemaining = false;
    }

    continue() {
        if(!this.isComplete()) {
            this.highlightSelectableCards();
        }

        return super.continue();
    }

    highlightSelectableCards() {
        let selectableCards = this.game.allCards.filter(card => {
            return this.checkCardCondition(card);
        });
        this.choosingPlayer.setSelectableCards(selectableCards);
    }

    activeCondition(player) {
        return player === this.choosingPlayer;
    }

    activePrompt() {
        let buttons = [{ text: 'Pass', arg: 'pass' }];
        let menuTitle = '';
        let promptTitle = '';
        
        if(this.conflict.conflictRing === '') {
            menuTitle = 'Choose an elemental ring';
            promptTitle = 'Initiate Conflict';
        } else {
            promptTitle = capitalize[this.conflict.conflictType] + ' ' + capitalize[this.conflict.conflictRing] + ' Conflict';
            if(!this.selectedProvince && !this.conflict.isSinglePlayer) {
                menuTitle = 'Choose province to attack';
            } else if(this.selectedAttackers.length === 0) {
                menuTitle = 'Choose attackers';
            } else {
                if(this.covertRemaining) {
                    menuTitle = 'Choose defenders to Covert';
                } else {
                    this.conflict.attackers = this.selectedAttackers;
                    this.conflict.calculateSkill();
                    menuTitle = capitalize[this.conflict.conflictType] + ' skill: '.concat(this.conflict.attackerSkill);
                }
                buttons.unshift({ text: 'Initiate Conflict', arg: 'done' });
            }
        }
        
        return {
            menuTitle: menuTitle,
            buttons: buttons,
            promptTitle: promptTitle,
            selectCard: true
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

    checkCardCondition(card) {
        if(card.isProvince && card.controller !== this.choosingPlayer && !card.isBroken) {
            if(!this.selectedProvince || card === this.selectedProvince) {
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
        let attackersWithCovert = _.size(_.filter(this.selectedAttackers, card => card.isCovert()));
        this.covertRemaining = attackersWithCovert > _.size(this.selectedDefenders);
    }

    selectCard(card) {
        if(card.isProvince) {
            this.selectedProvince = (card === this.selectedProvince) ? null : card;
        } else if(card.type === 'character') {
            if(card.controller === this.choosingPlayer) {
                if(!this.selectedAttackers.includes(card)) {
                    this.selectedAttackers.push(card);
                } else {
                    this.selectedAttackers = _.reject(this.selectedAttackers, c => c === card);
                }
            } else {
                if(!this.selectedDefenders.includes(card)) {
                    this.selectedDefenders.push(card);
                } else {
                    this.selectedDefenders = _.reject(this.selectedDefenders, c => c === card);
                }         
            }
            this.recalculateCovert();
        }
        
        let selectedCards = this.selectedAttackers.concat(this.selectedDefenders).concat([this.selectedProvince]);

        this.choosingPlayer.setSelectedCards(selectedCards);
        
        /*
        if(this.properties.onCardToggle) {
            this.properties.onCardToggle(this.choosingPlayer, card);
        }
        */
       
        return true;
    }

    onMenuCommand(player, arg) {
        if(player !== this.choosingPlayer) {
            return false;
        }

        if(arg === 'done') {
            this.conflict.conflictDeclared = true;
        } else if(arg === 'pass') {
            this.conflict.passed = true;
            this.game.raiseEvent('onConflictPass', this.conflict, () => {
                this.conflict.cancelConflict();
            });
        }
        
        this.complete();
    }
        
    complete() {
        this.conflict.attackers = this.selectedAttackers;
        _.each(this.selectedDefenders, card => {
            card.stealth = true;
        });
        this.conflict.conflictProvince = this.selectedProvince;
        this.clearSelection();
        return super.complete();
    }

    clearSelection() {
        this.choosingPlayer.clearSelectedCards();
        this.choosingPlayer.clearSelectableCards();
    }
}

module.exports = InitiateConflictPrompt;
