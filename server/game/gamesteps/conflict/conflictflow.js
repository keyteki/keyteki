const _ = require('underscore');
const BaseStep = require('../basestep.js');
const GamePipeline = require('../../gamepipeline.js');
const SimpleStep = require('../simplestep.js');
const ConflictActionWindow = require('../conflictactionwindow.js');
const InitiateConflictPrompt = require('./initiateconflictprompt.js');
const SelectDefendersPrompt = require('./selectdefendersprompt.js');

/**
Conflict Resolution
3.2 Declare Conflict
3.2.1 Declare defenders
3.2.2 CONFLICT ACTION WINDOW
    (Defender has first opportunity)
3.2.3 Compare skill values.
3.2.4 Apply unopposed.
3.2.5 Break province.
3.2.6 Resolve Ring effects.
3.2.7 Claim ring.
3.2.8 Return home. Go to (3.3).
 */

class ConflictFlow extends BaseStep {
    constructor(game, conflict) {
        super(game);
        this.conflict = conflict;
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.resetCards()),
            new InitiateConflictPrompt(this.game, this.conflict, this.conflict.attackingPlayer),
            new SimpleStep(this.game, () => this.initiateConflict()),
            new SimpleStep(this.game, () => this.announceAttackerSkill()),
            new SimpleStep(this.game, () => this.promptForDefenders()),
            new SimpleStep(this.game, () => this.announceDefenderSkill()),
            new ConflictActionWindow(this.game, 'Conflict Action Window', this.conflict),
            new SimpleStep(this.game, () => this.determineWinner()),
            new SimpleStep(this.game, () => this.applyKeywords()),
            new SimpleStep(this.game, () => this.applyUnopposed()),
            new SimpleStep(this.game, () => this.checkBreakProvince()),
            new SimpleStep(this.game, () => this.brokenProvinceEffect()),
            new SimpleStep(this.game, () => this.resolveRingEffects()),
            new SimpleStep(this.game, () => this.claimRing()),
            new SimpleStep(this.game, () => this.returnHome()),
            new SimpleStep(this.game, () => this.completeConflict())
        ]);
    }

    resetCards() {
        this.conflict.resetCards();
    }

    initiateConflict() {
        if(this.conflict.cancelled) {
            return;
        }
        
        let events = [{
            name: 'onConflictDeclared',
            params: { conflict: this.conflict, conflictType: this.conflict.conflictType, conflictRing: this.conflict.conflictRing }
        }];
        
        let ring = this.game.rings[this.conflict.conflictRing];
        ring.contested = true;
        this.conflict.addElement(this.conflict.conflictRing);
        this.conflict.attackingPlayer.conflicts.perform(this.conflict.conflictType);
        _.each(this.conflict.attackers, card => card.inConflict = true);
        if(ring.fate > 0) {
            events.push({
                name: 'onSelectRingWithFate',
                params: {
                    conflict: this.conflict,
                    ring: ring,
                    fate: ring.fate
                }
            });
            this.game.addFate(this.conflict.attackingPlayer, ring.fate);
            ring.removeFate();
        }

        this.game.addMessage('{0} is initiating a {1} conflict at {2}, contesting the {3} ring', this.conflict.attackingPlayer, this.conflict.conflictType, this.conflict.conflictProvince, this.conflict.conflictRing);
 
        if(!this.conflict.isSinglePlayer) {
            this.conflict.conflictProvince.inConflict = true;
            if(this.conflict.conflictProvince.facedown) {
                this.conflict.conflictProvince.facedown = false;
                events.push({
                    name: 'onProvinceRevealed',
                    params: {
                        conflict: this.conflict,
                        province: this.conflict.conflictProvince
                    }
                });
            }
        }
        this.game.reapplyStateDependentEffects();
        this.game.raiseAtomicEvent(events);
    }

    promptForAttackers() {
        var title = 'Select conflict attackers';
        if(this.conflict.attackingPlayer.conflictrLimit !== 0) {
            title += ' (limit ' + this.conflict.attackingPlayer.conflictrLimit + ')';
        }

        this.game.promptForSelect(this.conflict.attackingPlayer, {
            numCards: this.conflict.attackingPlayer.conflictrLimit,
            multiSelect: true,
            activePromptTitle: title,
            waitingPromptTitle: 'Waiting for opponent to select attackers',
            cardCondition: card => this.allowAsAttacker(card),
            onSelect: (player, attackers) => this.chooseAttackers(player, attackers),
            onCancel: () => this.conflict.cancelConflict()
        });
    }

    allowAsAttacker(card) {
        return this.conflict.attackingPlayer === card.controller && card.canDeclareAsAttacker(this.conflict.conflictType);
    }

    chooseAttackers(player, attackers) {
        this.conflict.addAttackers(attackers);

        return true;
    }
    
    announceAttackerSkill() {
        if(this.conflict.cancelled) {
            return;
        }

        // Explicitly recalculate strength in case an effect has modified character strength.
        this.conflict.calculateSkill();
        this.game.addMessage('{0} has initiated a {1} conflict with skill {2}', this.conflict.attackingPlayer, this.conflict.conflictType, this.conflict.attackerSkill);
    }

    promptForDefenders() {
        if(this.conflict.cancelled || this.conflict.isSinglePlayer) {
            return;
        }

        this.game.queueStep(new SelectDefendersPrompt(this.game, this.conflict.defendingPlayer, this.conflict));
    }

    allowAsDefender(card) {
        return this.conflict.defendingPlayer === card.controller && card.canDeclareAsDefender(this.conflict.conflictType);
    }

    chooseDefenders(defenders) {
        this.conflict.addDefenders(defenders);

        this.game.raiseEvent('onDefendersDeclared', { conflict: this.conflict });

        return true;
    }

    announceDefenderSkill() {
        if(this.conflict.cancelled || this.conflict.isSinglePlayer) {
            return;
        }

        // Explicitly recalculate strength in case an effect has modified character strength.
        _.each(this.conflict.defenders, card => card.inConflict = true);
        this.conflict.calculateSkill();
        if(this.conflict.defenders.length > 0) {
            this.game.addMessage('{0} has defended with skill {1}', this.conflict.defendingPlayer, this.conflict.defenderSkill);
        } else {
            this.game.addMessage('{0} does not defend the conflict', this.conflict.defendingPlayer);
        }

        this.game.raiseEvent('onDefendersDeclared', { conflict: this.conflict });
    }

    determineWinner() {
        if(this.conflict.cancelled) {
            return;
        }
        
        if(this.game.manualMode && !this.conflict.isSinglePlayer) {
            this.game.promptWithMenu(this.conflict.attackingPlayer, this, {
                activePrompt: {
                    promptTitle: 'Conflict Result',
                    menuTitle: 'How did the conflict resolve?',
                    buttons: [
                        { text: 'Attacker Won', arg: 'attacker', method: 'manuallyDetermineWinner' },
                        { text: 'Defender Won', arg: 'defender', method: 'manuallyDetermineWinner' },
                        { text: 'No Winner', arg: 'nowinner', method: 'manuallyDetermineWinner' }
                    ]
                },
                waitingPromptTitle: 'Waiting for opponent to resolve conflict'
            });
            return;
        } 

        this.conflict.determineWinner();

        if(!this.conflict.winner && !this.conflict.loser) {
            this.game.addMessage('There is no winner or loser for this conflict because both sides have 0 skill');
        } else {
            this.game.addMessage('{0} won a {1} conflict {2} vs {3}',
                this.conflict.winner, this.conflict.conflictType, this.conflict.winnerSkill, this.conflict.loserSkill);
            this.conflict.winner.conflicts.won(this.conflict.conflictType, this.conflict.winner === this.conflict.attackingPlayer);
            this.conflict.loser.conflicts.lost(this.conflict.conflictType, this.conflict.loser === this.conflict.attackingPlayer);
        }
    }
    
    manuallyDetermineWinner(player, choice) {
        if(choice === 'attacker') {
            this.conflict.winner = player;
            this.conflict.loser = this.conflict.defendingPlayer;
        } else if(choice === 'defender') {
            this.conflict.winner = this.conflict.defendingPlayer;
            this.conflict.loser = player;
        }
        if(!this.conflict.winner && !this.conflict.loser) {
            this.game.addMessage('There is no winner or loser for this conflict because both sides have 0 skill');
        } else {
            this.game.addMessage('{0} won a {1} conflict', this.conflict.winner, this.conflict.conflictType);
            this.conflict.winner.conflicts.won(this.conflict.conflictType, this.conflict.winner === this.conflict.attackingPlayer);
            this.conflict.loser.conflicts.lost(this.conflict.conflictType, this.conflict.loser === this.conflict.attackingPlayer);
        }
        return true;
    }

    applyKeywords() {
        if(this.conflict.isAttackerTheWinner() && this.conflict.defenders.length === 0) {
            this.conflict.conflictUnopposed = true;
        }
                
        if(this.conflict.isAttackerTheWinner()) {
            _.each(this.conflict.attackers, card => {
                if(card.hasPride()) {
                    this.conflict.attackingPlayer.honorCard(card);
                }
            });
            _.each(this.conflict.defenders, card => {
                if(card.hasPride()) {
                    this.conflict.defendingPlayer.dishonorCard(card);
                }
            });
        } else if(this.conflict.winner === this.conflict.defendingPlayer) {
            _.each(this.conflict.attackers, card => {
                if(card.hasPride()) {
                    this.conflict.attackingPlayer.dishonorCard(card);
                }
            });
            _.each(this.conflict.defenders, card => {
                if(card.hasPride()) {
                    this.conflict.defendingPlayer.honorCard(card);
                }
            });
        }
        
        this.game.raiseEvent('afterConflict', { conflict: this.conflict });
    }

    applyUnopposed() {
        if(this.conflict.cancelled || this.game.manualMode || this.conflict.isSinglePlayer) {
            return;
        }
        
        if(this.conflict.conflictUnopposed) {
            this.game.addMessage('{0} loses 1 honor for not defending the conflict', this.conflict.loser);
            this.game.addHonor(this.conflict.loser, -1);
        }
    }
    
    checkBreakProvince() {
        if(this.conflict.cancelled || this.conflict.isSinglePlayer || this.game.manualMode) {
            return;
        }

        let province = this.conflict.conflictProvince;
        if(this.conflict.isAttackerTheWinner() && this.conflict.skillDifference >= province.getStrength() && !province.isBroken) {
            this.game.raiseEvent('onBreakProvince', { conflict: this.conflict, province: province }, province.breakProvince());
            this.game.addMessage('{0} has broken {1}!', this.conflict.winner, province);
        }
    }
    
    brokenProvinceEffect() {
        if(this.conflict.cancelled || this.conflict.isSinglePlayer || this.game.manualMode) {
            return;
        }

        let province = this.conflict.conflictProvince;
        if(province && province.isBroken && this.conflict.isAttackerTheWinner()) {
            if(province.location === 'stronghold province') {
                this.game.recordWinner(this.conflict.winner, 'conquest');
            } else {
                let dynastyCard = province.controller.getDynastyCardInProvince(province.location);
                if(dynastyCard) {
                    let promptTitle = 'Do you wish to discard ' + (dynastyCard.facedown ? 'the facedown card' : dynastyCard.name) + '?';
                    this.game.promptWithHandlerMenu(this.conflict.winner, {
                        activePromptTitle: promptTitle,
                        source: 'Break ' + province.name,
                        choices: ['Yes', 'No'],
                        handlers: [
                            () => {
                                this.game.addMessage('{0} chooses to discard {1}', this.conflict.winner, dynastyCard.facedown ? 'the facedown card' : dynastyCard);
                                province.controller.moveCard(dynastyCard, 'dynasty discard pile');
                            },
                            () => this.game.addMessage('{0} chooses not to discard {1}', this.conflict.winner, dynastyCard.facedown ? 'the facedown card' : dynastyCard)
                        ]
                    });
                }
            }
        }
    }
    
    resolveRingEffects() {
        if(this.conflict.cancelled) {
            return;
        }

        if(this.conflict.isAttackerTheWinner()) {
            this.game.raiseEvent('onResolveRingEffects', { player: this.conflict.winner, conflict: this.conflict }, () => this.game.promptWithHandlerMenu(this.conflict.winner, {
                activePromptTitle: 'Do you want to resolve the conflict ring?',
                waitingPromptTitle: 'Waiting for opponent to use decide whether to resolve the conflict ring',
                source: 'Resolve Ring Effects',
                choices: ['Yes', 'No'],
                handlers: [() => this.conflict.resolveRingEffects(), () => true]
            }));
        }       
    }
    
    claimRing() {
        if(this.conflict.cancelled) {
            return;
        }

        let ring = this.game.rings[this.conflict.conflictRing];
        if(this.conflict.winner) {
            this.game.raiseEvent('onClaimRing', { player: this.conflict.winner, conflict: this.conflict }, () => ring.claimRing(this.conflict.winner));

        }
        //Do this lazily for now
        ring.contested = false;
    }

    returnHome() {
        if(this.conflict.cancelled) {
            return;
        }

        this.game.raiseSimultaneousEvent(this.conflict.attackers.concat(this.conflict.defenders), {
            eventName: 'onParticipantsReturnHome',
            perCardEventName: 'OnReturnHome',
            perCardHandler: (params) => params.card.returnHomeFromConflict(), 
            params: { conflict: this.conflict }
        });
    }
    
    completeConflict() {
        if(this.conflict.cancelled) {
            return;
        }

        this.game.raiseEvent('onConflictFinished', { conflict: this.conflict });
        this.game.raiseEvent('onAtEndOfConflict');

        this.resetCards();
        if(!this.game.militaryConflictCompleted && (this.conflict.conflictType === 'military' || this.conflict.conflictTypeSwitched)) {
            this.game.militaryConflictCompleted = true;
        }
        if(!this.game.politicalConflictCompleted && (this.conflict.conflictType === 'political' || this.conflict.conflictTypeSwitched)) {
            this.game.politicalConflictCompleted = true;
        }

        this.conflict.finish();
    }

    onCardClicked(player, card) {
        return this.pipeline.handleCardClicked(player, card);
    }

    onRingClicked(player, ring) {
        return this.pipeline.handleRingClicked(player, ring);
    }

    onMenuCommand(player, arg, method) {
        return this.pipeline.handleMenuCommand(player, arg, method);
    }

    cancelStep() {
        this.pipeline.cancelStep();
    }

    queueStep(step) {
        this.pipeline.queueStep(step);
    }

    continue() {
        return this.conflict.cancelled || this.pipeline.continue();
    }
}

module.exports = ConflictFlow;
