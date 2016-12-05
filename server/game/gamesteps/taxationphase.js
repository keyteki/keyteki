const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const DiscardToReservePrompt = require('./taxation/discardtoreserveprompt.js');
const EndRoundPrompt = require('./taxation/endroundprompt.js');

class TaxationPhase extends Phase {
    constructor(game) {
        super(game);
        this.initialise([
            new SimpleStep(game, () => this.returnGold()),
            new DiscardToReservePrompt(game),
            new EndRoundPrompt(game)
        ]);
    }

    returnGold() {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            player.taxation();
            this.game.raiseEvent('onAfterTaxation', player);
        });
    }
}

module.exports = TaxationPhase;
