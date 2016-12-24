const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const DiscardToReservePrompt = require('./taxation/discardtoreserveprompt.js');
const EndRoundPrompt = require('./taxation/endroundprompt.js');

class TaxationPhase extends Phase {
    constructor(game) {
        super(game, 'taxation');
        this.initialise([
            new SimpleStep(game, () => this.returnGold()),
            new DiscardToReservePrompt(game),
            new EndRoundPrompt(game),
            new SimpleStep(game, () => this.endPhase())
        ]);
    }

    returnGold() {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            var event = this.game.raiseEvent('onBeforeTaxation', player);
            if(!event.cancel) {
                player.taxation();
            }
            
            this.game.raiseEvent('onAfterTaxation', player);
        });
    }

    endPhase() {
        this.game.raiseEvent('onPhaseEnd', 'taxation');
    }    
}

module.exports = TaxationPhase;
