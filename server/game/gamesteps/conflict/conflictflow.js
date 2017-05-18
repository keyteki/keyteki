const _ = require('underscore');
const BaseStep = require('../basestep.js');
const GamePipeline = require('../../gamepipeline.js');
const SimpleStep = require('../simplestep.js');
const ActionWindow = require('../actionwindow.js');
const GameKeywords = require('../../gamekeywords.js');

class ConflictFlow extends BaseStep {
    constructor(game, conflict) {
        super(game);
        this.conflict = conflict;
        this.pipeline = new GamePipeline();
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.resetCards()),
            new SimpleStep(this.game, () => this.announceConflict()),
            new SimpleStep(this.game, () => this.promptForAttackers()),
            new SimpleStep(this.game, () => this.announceAttackerStrength()),
            new ActionWindow(this.game, 'After attackers declared', 'attackersDeclared'),
            new SimpleStep(this.game, () => this.promptForDefenders()),
            new SimpleStep(this.game, () => this.announceDefenderStrength()),
            new ActionWindow(this.game, 'After defenders declared', 'defendersDeclared'),
            new SimpleStep(this.game, () => this.determineWinner()),
            new SimpleStep(this.game, () => this.unopposedPower()),
            new SimpleStep(this.game, () => this.applyKeywords()),
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

    announceAttackerStrength() {
        // Explicitly recalculate strength in case an effect has modified character strength.
        this.conflict.calculateStrength();
        this.game.addMessage('{0} has initiated a {1} conflict with strength {2}', this.conflict.attackingPlayer, this.conflict.conflictType, this.conflict.attackerStrength);
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

    announceDefenderStrength() {
        // Explicitly recalculate strength in case an effect has modified character strength.
        this.conflict.calculateStrength();
        if(this.conflict.defenderStrength > 0) {
            this.game.addMessage('{0} has defended with strength {1}', this.conflict.defendingPlayer, this.conflict.defenderStrength);
        } else {
            this.game.addMessage('{0} does not defend the conflict', this.conflict.defendingPlayer);
        }
    }

    determineWinner() {
        this.conflict.determineWinner();

        if(!this.conflict.winner && !this.conflict.loser) {
            this.game.addMessage(this.conflict.noWinnerMessage);
        } else {
            this.game.addMessage('{0} won a {1} conflict {2} vs {3}',
                this.conflict.winner, this.conflict.conflictType, this.conflict.winnerStrength, this.conflict.loserStrength);
        }

        this.game.raiseEvent('afterConflict', this.conflict);

        // Only open a winner action window if a winner / loser was determined.
        if(this.conflict.winner) {
            this.game.queueStep(new ActionWindow(this.game, 'After winner determined', 'winnerDetermined'));
        }
    }

    applyKeywords() {
        var winnerCards = this.conflict.getWinnerCards();

        _.each(winnerCards, card => {
            let context = { game: this.game, conflict: this.conflict, source: card };

            if(card.hasKeyword('Insight')) {
                this.game.resolveAbility(GameKeywords.insight, context);
            }

            if(card.hasKeyword('Intimidate')) {
                this.game.resolveAbility(GameKeywords.intimidate, context);
            }

            if(card.hasKeyword('Pillage')) {
                this.game.resolveAbility(GameKeywords.pillage, context);
            }

            if(card.isRenown()) {
                this.game.resolveAbility(GameKeywords.renown, context);
            }

            this.game.checkWinCondition(this.conflict.winner);
        });
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
