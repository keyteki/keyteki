const { EVENTS } = require('../Events/types.js');
const BaseStep = require('./basestep.js');
const SimpleStep = require('./simplestep.js');
const KeyPhase = require('./key/KeyPhase.js');

/**
 * FinalTurn handles the final partial turn after time is called.
 * Per tiebreaker rules:
 * 1. After both players complete their post-time turns
 * 2. First player starts a final turn that proceeds only through the "Forge a Key" step
 * 3. Then the tiebreaker is evaluated
 */
class FinalTurn extends BaseStep {
    /**
     * @param {import('../game')} game
     */
    constructor(game) {
        super(game);
        this.started = false;
    }

    continue() {
        if (!this.started) {
            this.started = true;
            this.startFinalTurn();
        }
        return true; // Step is complete
    }

    startFinalTurn() {
        this.game.addAlert(
            'info',
            'Time has been called. {0} takes their final turn until their "Forge a Key" step has been completed.',
            this.game.activePlayer
        );

        this.game.raiseEvent(EVENTS.onTurnStart, { player: this.game.activePlayer });
        this.game.activePlayer.beginRound();

        // Queue KeyPhase and then the tiebreaker check
        this.game.queueStep(new KeyPhase(this.game));
        this.game.queueStep(new SimpleStep(this.game, () => this.endFinalTurn()));
    }

    endFinalTurn() {
        this.game.addAlert('endofturn', 'Final turn has ended.');
        this.game.finalTurnCompleted = true;
        this.game.checkWinCondition();
    }
}

module.exports = FinalTurn;
