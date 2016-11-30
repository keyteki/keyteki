const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const KeepOrMulliganPrompt = require('./setup/keepormulliganprompt.js');
const SetupCardsPrompt = require('./setup/setupcardsprompt.js');
const CheckAttachmentsPrompt = require('./setup/checkattachmentsprompt.js');

class SetupPhase extends Phase {
    constructor(game) {
        super(game);
        this.initialise([
            new KeepOrMulliganPrompt(game),
            new SimpleStep(game, () => this.startGame()),
            new SetupCardsPrompt(game),
            new CheckAttachmentsPrompt(game),
            new SimpleStep(game, () => this.setupDone()),
            new SimpleStep(game, () => this.beginRound())
        ]);
    }

    startGame() {
        _.each(this.game.getPlayers(), player => {
            player.startGame();
        });
        this.game.playStarted = true;
    }

    setupDone() {
        _.each(this.game.getPlayers(), p => {
            p.setupDone();
        });
    }

    beginRound() {
        this.game.beginRound();
    }
}

module.exports = SetupPhase;
