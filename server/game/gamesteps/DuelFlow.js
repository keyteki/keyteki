const BaseStepWithPipeline = require('./basestepwithpipeline.js');
const SimpleStep = require('./simplestep.js');
const HonorBidPrompt = require('./honorbidprompt.js');

/**
D. Duel Timing
D.1 Duel begins.
D.2 Establish challenger and challengee.
D.3 Duel honor bid.
D.4 Reveal honor dials.
D.5 Transfer honor.
D.6 Modify dueling skill.
D.7 Compare skill value and determine results.
D.8 Apply duel results.
D.9 Duel ends.
 */

class DuelFlow extends BaseStepWithPipeline {
    constructor(game, duel, costHandler, resolutionHandler) {
        super(game);
        this.duel = duel;
        this.resolutionHandler = resolutionHandler;
        this.pipeline.initialise([
            new HonorBidPrompt(this.game, 'Choose your bid for the duel\n' + this.duel.getTotalsForDisplay()),
            new SimpleStep(this.game, costHandler),
            new SimpleStep(this.game, () => this.modifyDuelingSkill()),
            new SimpleStep(this.game, () => this.determineResults()),
            new SimpleStep(this.game, () => this.announceResult()),
            new SimpleStep(this.game, () => this.applyDuelResults()),
        ]);
    }

    modifyDuelingSkill() {
        this.duel.setBidFinished();
    }

    determineResults() {
        this.duel.determineResults();
    }

    announceResult() {
        this.game.addMessage(this.duel.getTotalsForDisplay());
        if(!this.duel.winner) {
            this.game.addMessage('The duel ends in a draw');
        }
    }

    applyDuelResults() {
        if(this.duel.winner) {
            this.resolutionHandler(this.duel.winner, this.duel.loser)
        }
    }
}

module.exports = DuelFlow;
