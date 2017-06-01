const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const KeepOrMulliganPrompt = require('./setup/keepormulliganprompt.js');
const SetupProvincesPrompt = require('./setup/setupprovincesprompt.js');

class SetupPhase extends Phase {
    constructor(game) {
        super(game, 'setup');
        this.initialise([
            new SimpleStep(game, () => this.prepareDecks()),
            new SetupProvincesPrompt(game),
                        //Attach stronghold
            new KeepOrMulliganPrompt(game),
            new SimpleStep(game, () => this.startGame()),
            new SimpleStep(game, () => this.setupDone()),
        ]);
    }

    prepareDecks() {
        this.game.raiseEvent('onDecksPrepared');
    }

    startGame() {
        _.each(this.game.getPlayers(), player => {
            player.startGame();
        });
    }

    setupDone() {
        _.each(this.game.getPlayers(), p => {
            p.setupDone();
        });
    }
}

module.exports = SetupPhase;
