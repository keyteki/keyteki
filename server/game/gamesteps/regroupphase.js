const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const ActionWindow = require('./actionwindow.js');
const EndRoundPrompt = require('./regroup/endroundprompt.js')

class RegroupPhase extends Phase {
    constructor(game) {
        super(game, 'regroup');
        this.initialise([
            new SimpleStep(game, () => this.readyCards()),
            new ActionWindow(this.game, 'After cards ready', 'readying'),
            new EndRoundPrompt(game),
            new SimpleStep(game, () => this.roundEnded())
        ]);
    }

    readyCards() {
        this.game.raiseEvent('onReadyAllCards', () => {
            _.each(this.game.getPlayers(), player => {
                player.readyCards();
            });
        });
    }
}

module.exports = RegroupPhase;
