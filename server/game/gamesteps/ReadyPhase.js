const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');

class ReadyPhase extends Phase {
    constructor(game) {
        super(game, 'ready');
        this.initialise([
            new SimpleStep(game, () => this.readyCards())
        ]);
    }

    readyCards() {
        this.game.addMessage('{0} readies all their cards', this.game.activePlayer);
        this.game.actions.ready().resolve(this.game.activePlayer.cardsInPlay, this.game.getFrameworkContext());
    }
}

module.exports = ReadyPhase;
