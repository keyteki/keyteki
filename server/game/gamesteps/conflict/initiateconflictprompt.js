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
    constructor(game, conflict, choosingPlayer, attackerChoosesRing = true) {
        super(game);
        
        this.conflict = conflict;
        this.choosingPlayer = choosingPlayer;
        this.attackerChoosesRing = attackerChoosesRing;
        this.selectedDefenders = [];
        this.covertRemaining = false;
    }

    continue() {
        if(!this.isComplete()) {
            this.highlightSelectableRings();
        }

        return super.continue();
    }

    highlightSelectableRings() {
        let selectableRings = _.filter(this.game.rings, ring => {
            return this.checkRingCondition(ring);
        });
        this.choosingPlayer.setSelectableRings(selectableRings);
    }

    activeCondition(player) {
        return player === this.choosingPlayer;
    }

    activePrompt() {
        let buttons = [];
        let menuTitle = '';
        let promptTitle = '';
        
        if(this.attackerChoosesRing) {
            buttons.push({ text: 'Pass Conflict', arg: 'pass' });
        }

        if(this.conflict.conflictRing === '') {
            menuTitle = 'Choose an elemental ring\n(click the ring again to change conflict type)';
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
                    menuTitle = capitalize[this.conflict.conflictType] + ' skill: '.concat(this.conflict.attackerSkill);
                }
                buttons.unshift({ text: 'Initiate Conflict', arg: 'done' });
            }
        }        

        return {
            selectRing: true,
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

        if(!this.checkRingCondition(ring)) {
            return false;
        }

        return this.selectRing(ring);
    }

    selectRing(ring) {
        let player = this.choosingPlayer;

        let canInitiateThisConflictType = !player.conflicts.isAtMax(ring.conflictType);        
        let canInitiateOtherConflictType = !player.conflicts.isAtMax(ring.conflictType === 'military' ? 'political' : 'military');

        if(this.conflict.conflictRing === ring.element) {
            if(!canInitiateOtherConflictType) {
                return false;
            }
            this.game.flipRing(player, ring);
        } else if(!canInitiateThisConflictType || this.conflict.attackers.some(card => !card.canDeclareAsAttacker(ring.conflictType))) {
            this.game.flipRing(player, ring);
        }

        this.conflict.conflictRing = ring.element;
        this.conflict.conflictType = ring.conflictType;
        if(this.conflict.conflictProvince && !this.conflict.conflictProvince.allowGameAction('initiateConflict')) {
            this.conflict.conflictProvince.inConflict = false;
            this.conflict.conflictProvince = null;
        }

        _.each(this.conflict.attackers, card => {
            if(!card.canDeclareAsAttacker(ring.conflictType)) {
                this.removeFromConflict(card);
            }
        });

        this.conflict.calculateSkill(true);
        this.recalculateCovert();

        return true;
    }

    checkRingCondition(ring) {
        if(!this.attackerChoosesRing && ring.element !== this.conflict.conflictRing) {
            return false;
        }
        return ring.canDeclare(this.choosingPlayer);
    }

    checkCardCondition(card) {
        if(card.isProvince && card.controller !== this.choosingPlayer && !card.isBroken && card.allowGameAction('initiateConflict')) {
            if(card.location === 'stronghold province' && _.size(this.game.allCards.filter(card => card.isProvince && card.isBroken && card.controller !== this.choosingPlayer)) < 3) {
                return false;
            }
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
                } else {
                    this.removeFromConflict(card);
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
        }

        this.conflict.calculateSkill(true);
        this.recalculateCovert();

        return true;
    }

    removeFromConflict(card) {
        if(card.isCovert() && !this.covertRemaining) {
            this.selectedDefenders.pop().covert = false;
        }
        this.conflict.removeFromConflict(card);
    }

    menuCommand(player, arg) {
        if(arg === 'done') {
            let keys = _.keys(capitalize);
            if(!keys.includes(this.conflict.conflictType) || !keys.includes(this.conflict.conflictRing) || 
                                (!this.conflict.isSinglePlayer && !this.conflict.conflictProvince) || this.conflict.attackers.length === 0) {
                return;
            }
            if(this.covertRemaining && this.conflict.defendingPlayer.anyCardsInPlay(card => {
                return card.canBeBypassedByCovert() && !card.covert && !card.bowed;
            })) {
                this.game.promptWithHandlerMenu(this.choosingPlayer, {
                    activePromptTitle: 'You still have unused Covert - are you sure?',
                    source: 'Declare Conflict',
                    choices: ['Yes', 'No'],
                    handlers: [
                        () => {
                            this.complete();
                            this.conflict.conflictDeclared = true;
                        },
                        () => true
                    ]
                });
            } else {
                this.complete();
                this.conflict.conflictDeclared = true;
            }
        } else if(arg === 'pass') {
            this.game.promptWithHandlerMenu(this.choosingPlayer, {
                activePromptTitle: 'Are you sure you want to pass your conflict opportunity?',
                source: 'Pass Conflict',
                choices: ['Yes', 'No'],
                handlers: [
                    () => {
                        this.complete();
                        this.conflict.passConflict();
                    },
                    () => true
                ]
            });
        }
    }
}

module.exports = InitiateConflictPrompt;
