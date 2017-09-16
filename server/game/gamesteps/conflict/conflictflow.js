const _ = require('underscore');
const BaseStep = require('../basestep.js');
const GamePipeline = require('../../gamepipeline.js');
const SimpleStep = require('../simplestep.js');
const ActionWindow = require('../actionwindow.js');

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
            new SimpleStep(this.game, () => this.announceConflict()),
            new SimpleStep(this.game, () => this.promptForAttackers()),
            //Reveal province
            new SimpleStep(this.game, () => this.announceAttackerSkill()),
            new SimpleStep(this.game, () => this.promptForDefenders()),
            new SimpleStep(this.game, () => this.announceDefenderSkill()),
            new ActionWindow(this.game, 'Conflict Action Window', 'conflictAction'),
            new SimpleStep(this.game, () => this.determineWinner()),
            //new SimpleStep(this.game, () => this.applyKeywords()),
            new SimpleStep(this.game, () => this.applyUnopposed()),
            //Check for Province Break
            new SimpleStep(this.game, () => this.resolveRingEffects()),
            new SimpleStep(this.game, () => this.claimRing()),
            new SimpleStep(this.game, () => this.returnHome()),
            new SimpleStep(this.game, () => this.completeConflict())
        ]);
    }

    resetCards() {
        this.conflict.resetCards();
    }

    announceConflict() {
        this.game.addMessage('{0} is initiating a {1} conflict', this.conflict.attackingPlayer, this.conflict.conflictType);
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
        // Explicitly recalculate strength in case an effect has modified character strength.
        this.conflict.calculateSkill();
        this.game.addMessage('{0} has initiated a {1} conflict with skill {2}', this.conflict.attackingPlayer, this.conflict.conflictType, this.conflict.attackerSkill);
    }

    promptForDefenders() {
        if(this.conflict.isSinglePlayer) {
            return;
        }

        var title = 'Select defenders';
        if(this.conflict.defendingPlayer.conflictrLimit !== 0) {
            title += ' (limit ' + this.conflict.defendingPlayer.conflictrLimit + ')';
        }

        this.game.promptForSelect(this.conflict.defendingPlayer, {
            numCards: this.conflict.defendingPlayer.conflictrLimit,
            multiSelect: true,
            activePromptTitle: title,
            waitingPromptTitle: 'Waiting for opponent to defend',
            cardCondition: card => this.allowAsDefender(card),
            onSelect: (player, defenders) => this.chooseDefenders(defenders),
            onCancel: () => this.chooseDefenders([])
        });
    }

    allowAsDefender(card) {
        return this.conflict.defendingPlayer === card.controller && card.canDeclareAsDefender(this.conflict.conflictType);
    }

    chooseDefenders(defenders) {
        this.conflict.addDefenders(defenders);

        this.game.raiseEvent('onDefendersDeclared', this.conflict);

        return true;
    }

    announceDefenderSkill() {
        // Explicitly recalculate strength in case an effect has modified character strength.
        this.conflict.calculateSkill();
        if(this.conflict.defenders === []) {
            this.game.addMessage('{0} does not defend the conflict', this.conflict.defendingPlayer);
        } else {
            this.game.addMessage('{0} has defended with skill {1}', this.conflict.defendingPlayer, this.conflict.defenderSkill);
        }
    }

    determineWinner() {
        this.conflict.determineWinner();

        if(!this.conflict.winner && !this.conflict.loser) {
            this.game.addMessage('There is no winner or loser for this conflict because both sides have 0 skill');
        } else {
            this.game.addMessage('{0} won a {1} conflict {2} vs {3}',
                this.conflict.winner, this.conflict.conflictType, this.conflict.winnerSkill, this.conflict.loserSkill);
            this.conflict.winner.conflicts.won(this.conflict.conflictType, this.conflict.winner === this.conflict.attackingPlayer);
            this.conflict.loser.conflicts.lost(this.conflict.conflictType, this.conflict.loser === this.conflict.attackingPlayer);
        }

        this.game.raiseEvent('afterConflict', this.conflict);
    }

    applyKeywords() {
        var winnerCards = this.conflict.getWinnerCards();

        _.each(winnerCards, () => {
            this.game.checkWinCondition(this.conflict.winner);
        });
    }

    applyUnopposed() {
        if(this.conflict.cancelled) {
            return;
        }

        if(this.conflict.winner === this.conflict.attackingPlayer && this.conflict.defenders === []) {
            this.game.addHonor(this.conflict.loser, -1);
        }
    }
    
    resolveRingEffects() {
        if(this.conflict.cancelled) {
            return;
        }

        if(this.conflict.isAttackerTheWinner()) {
            let menuTitle = 'Do you want to resolve the ' + this.conflict.conflictRing + ' ring?';
            let waitingPromptTitle = 'Waiting for opponent to use decide whether to resolve the ' + this.conflict.conflictRing + ' ring';
            this.game.promptWithMenu(this.conflict.winner, this, {
                activePrompt: {
                    promptTitle: 'Resolve Ring',
                    menuTitle: menuTitle,
                    buttons: [
                        { text: 'Yes', arg: 'Yes', method: 'triggerRingResolutionEvent' },
                        { text: 'No', arg: 'No', method: 'triggerRingResolutionEvent' }
                    ]
                },
                waitingPromptTitle: waitingPromptTitle
            });
        }       
    }
    
    triggerRingResolutionEvent(player, arg) {
        if(arg !== 'No') {
            this.game.raiseEvent('onResolveRingEffects', this.conflict, () => {
                player.resolveRingEffects(this.conflict.conflictRing);
            });
        }
        return true;
    }
    
    claimRing() {
        if(this.conflict.cancelled) {
            return;
        }

        if(this.conflict.winner) {
            let ring = _.find(this.game.rings, ring => {
                return ring.element === this.conflict.conflictRing;
            });
            this.game.raiseEvent('onClaimRing', this.conflict, ring.claimRing(this.conflict.winner));
        }
    }

    returnHome() {
        if(this.conflict.cancelled) {
            return;
        }

        this.game.raiseEvent('onReturnHome', this.conflict);
        _.each(this.conflict.attackers, card => card.returnHomeFromConflict('attacker'));
        _.each(this.conflict.defenders, card => card.returnHomeFromConflict('defender'));
    }
    
    completeConflict() {
        this.game.raiseEvent('onConflictFinished', this.conflict);

        this.resetCards();

        this.conflict.finish();
    }

    onCardClicked(player, card) {
        return this.pipeline.handleCardClicked(player, card);
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
