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
            new EndRoundPrompt(game),
            new SimpleStep(game, () => this.startPlotPhase())
        ]);
    }

    returnGold() {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            player.taxation();
            this.game.emit('onAfterTaxation', player);
        });
    }

    // Temporary step until plot phase / round structure is more defined.
    startPlotPhase() {
        _.each(this.game.getPlayers(), player => {
            player.startPlotPhase();
        });
    }
}

module.exports = TaxationPhase;
