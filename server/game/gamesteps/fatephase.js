const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const DiscardToReservePrompt = require('./fate/discardtoreserveprompt.js');

class FatePhase extends Phase {
    constructor(game) {
        super(game, 'fate');
        this.initialise([
            new SimpleStep(game, () => this.returnGold()),
            new DiscardToReservePrompt(game)
        ]);
    }

    returnGold() {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            this.game.raiseEvent('onUnspentGoldReturned', { player: player }, () => {
                player.taxation();
            });
        });
    }

    roundEnded() {
        this.game.raiseEvent('onRoundEnded');
    }
}

module.exports = FatePhase;
