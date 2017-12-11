const _ = require('underscore');
const AbilityContext = require('../../AbilityContext');
const BaseStepWithPipeline = require('../basestepwithpipeline.js');
const CovertAbility = require('./CovertAbility');
const SimpleStep = require('../simplestep.js');
const ConflictActionWindow = require('./conflictactionwindow.js');
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

class ConflictFlow extends BaseStepWithPipeline {
    constructor(game, conflict) {
        super(game);
        this.conflict = conflict;
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.resetCards()),
            new InitiateConflictPrompt(this.game, this.conflict, this.conflict.attackingPlayer),
            new SimpleStep(this.game, () => this.initiateConflict()),
            new SimpleStep(this.game, () => this.resolveCovert()),
            new SimpleStep(this.game, () => this.raiseDeclarationEvents()),
            new SimpleStep(this.game, () => this.announceAttackerSkill()),
            new SimpleStep(this.game, () => this.promptForDefenders()),
            new SimpleStep(this.game, () => this.announceDefenderSkill()),
            new SimpleStep(this.game, () => this.openConflictActionWindow()),
            new SimpleStep(this.game, () => this.determineWinner()),
            new SimpleStep(this.game, () => this.applyKeywords()),
            new SimpleStep(this.game, () => this.applyUnopposed()),
            new SimpleStep(this.game, () => this.checkBreakProvince()),
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
        
        let ring = this.game.rings[this.conflict.conflictRing];
        ring.contested = true;
        this.conflict.addElement(this.conflict.conflictRing);
        this.conflict.attackingPlayer.conflicts.perform(this.conflict.conflictType);
        _.each(this.conflict.attackers, card => card.inConflict = true);
        this.game.addMessage('{0} is initiating a {1} conflict at {2}, contesting the {3} ring', this.conflict.attackingPlayer, this.conflict.conflictType, this.conflict.conflictProvince, this.conflict.conflictRing);
    }

    resolveCovert() {
        if(this.conflict.cancelled || this.conflict.isSinglePlayer) {
            return;
        }

        let targets = this.conflict.defendingPlayer.cardsInPlay.filter(card => card.covert);
        let sources = _.filter(this.conflict.attackers, card => card.isCovert());
        _.each(targets, card => card.covert = false);
        if(sources.length > targets.length) {
            sources = _.first(sources, targets.length);
        }

        let events = _.map(_.zip(sources, targets), array => {
            let [source, target] = array;
            let context = new AbilityContext({ game: this.game, player: this.conflict.attackingPlayer, source: source, ability: new CovertAbility({}) });
            context.targets.target = target;
            return {
                params: { card: source, context: context },
                handler: () => target.covert = true
            };
        });

        this.game.raiseMultipleInitiateAbilityEvents(events);
    }

    raiseDeclarationEvents() {
        if(this.conflict.cancelled) {
            return;
        }

        let events = [{
            name: 'onConflictDeclared',
            params: { conflict: this.conflict, conflictType: this.conflict.conflictType, conflictRing: this.conflict.conflictRing }
        }];

        let ring = this.game.rings[this.conflict.conflictRing];
        if(ring.fate > 0 && this.conflict.attackingPlayer.allowGameAction('takeFateFromRings')) {
            events.push({
                name: 'onSelectRingWithFate',
                params: {
                    player: this.conflict.attackingPlayer,
                    conflict: this.conflict,
                    ring: ring,
                    fate: ring.fate
                }
            });
            this.game.addMessage('{0} takes {1} fate from the {2} ring', this.conflict.attackingPlayer, ring.fate, this.conflict.conflictRing);
            this.game.addFate(this.conflict.attackingPlayer, ring.fate);
            ring.removeFate();
        }

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
        this.game.raiseMultipleEvents(events);
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

    announceDefenderSkill() {
        if(this.conflict.cancelled || this.conflict.isSinglePlayer) {
            return;
        }

        // Explicitly recalculate strength in case an effect has modified character strength.
        _.each(this.conflict.defenders, card => card.inConflict = true);
        this.conflict.defendingPlayer.cardsInPlay.each(card => card.covert = false);
        this.conflict.calculateSkill();
        if(this.conflict.defenders.length > 0) {
            this.game.addMessage('{0} has defended with skill {1}', this.conflict.defendingPlayer, this.conflict.defenderSkill);
        } else {
            this.game.addMessage('{0} does not defend the conflict', this.conflict.defendingPlayer);
        }

        this.game.raiseEvent('onDefendersDeclared', { conflict: this.conflict });
    }
    
    openConflictActionWindow() {
        if(this.conflict.cancelled) {
            return;
        }
        this.queueStep(new ConflictActionWindow(this.game, 'Conflict Action Window', this.conflict));
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
            this.conflict.defendingPlayer.breakProvince(province);
            
        }
    }
    
    resolveRingEffects() {
        if(this.conflict.cancelled) {
            return;
        }

        this.game.reapplyStateDependentEffects();

        if(this.conflict.isAttackerTheWinner()) {
            this.conflict.chooseWhetherToResolveRingEffect();
        }       
    }
    
    claimRing() {
        if(this.conflict.cancelled) {
            return;
        }

        let ring = this.game.rings[this.conflict.conflictRing];
        if(ring.claimed) {
            return;
        }
        if(this.conflict.winner) {
            this.game.raiseEvent('onClaimRing', { player: this.conflict.winner, conflict: this.conflict }, () => {
                ring.claimRing(this.conflict.winner);
                return { resolved: true, success: true };
            });

        }
        //Do this lazily for now
        ring.contested = false;
    }

    returnHome() {
        if(this.conflict.cancelled) {
            return;
        }

        let cards = this.conflict.attackers.concat(this.conflict.defenders);
        
        let events = _.map(cards, card => {
            return {
                name: 'onReturnHome',
                params: {
                    card: card,
                    conflict: this.conflict,
                    bowedPreReturn: card.bowed
                },
                handler: () => card.returnHomeFromConflict()
            };
        });
        this.game.raiseMultipleEvents(events, {
            name: 'onParticipantsReturnHome', 
            params: { 
                cards: cards, 
                conflict: this.conflict
            }
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
}

module.exports = ConflictFlow;
