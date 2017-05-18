const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const DynastyCardsPrompt = require('./dynasty/dynastycardsprompt.js');

class DynastyPhase extends Phase {
    constructor(game) {
        super(game, 'dynasty');
        this.initialise([
            new SimpleStep(game, () => this.beginDynasty()),
            new SimpleStep(game, () => this.promptForDynasty())
        ]);
    }

    beginDynasty() {
        this.remainingPlayers = this.game.getPlayersInFirstPlayerOrder();
    }

    promptForDynasty() {
        var currentPlayer = this.remainingPlayers.shift();
        this.game.raiseEvent('onBeginDynasty', currentPlayer);
        currentPlayer.beginDynasty();
        this.game.queueStep(new DynastyCardsPrompt(this.game, currentPlayer));
        return this.remainingPlayers.length === 0;
    }
}

module.exports = DynastyPhase;
