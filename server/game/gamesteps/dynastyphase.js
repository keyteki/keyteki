const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const DynastyActionPrompt = require('./dynasty/dynastyactionprompt.js');
const DynastyActionOrPassPrompt = require('./dynasty/dynastyactionorpassprompt.js');

class DynastyPhase extends Phase {
    constructor(game) {
        super(game, 'dynasty');
        this.initialise([
            new SimpleStep(game, () => this.beginDynasty()),
            new SimpleStep(game, () => this.promptForDynastyActionOrPass())
        ]);
    }

    beginDynasty() {
        this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
    }

    promptForDynastyActionOrPass() {
        var currentPlayer = this.remainingPlayers.shift();
        this.game.raiseEvent('onBeginDynasty', currentPlayer);
        currentPlayer.beginDynasty();
        this.game.queueStep(new DynastyActionOrPassPrompt(this.game, currentPlayer));
        return this.remainingPlayers.length === 0;
    }
}

module.exports = DynastyPhase;
