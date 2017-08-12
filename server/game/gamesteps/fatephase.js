const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const DiscardToReservePrompt = require('./fate/discardtoreserveprompt.js');

/*
IV Fate Phase
4.1 Fate phase begins.
4.2 Discard characters with no fate.
4.3 Remove fate from characters.
4.4 Place fate on unclaimed rings.
    ACTION WINDOW
4.5 Fate phase ends.
 */

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
