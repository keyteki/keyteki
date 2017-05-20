const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const KeepOrMulliganPrompt = require('./setup/keepormulliganprompt.js');
const SetupCardsPrompt = require('./setup/setupcardsprompt.js');
const CheckAttachmentsPrompt = require('./setup/checkattachmentsprompt.js');

class SetupPhase extends Phase {
    constructor(game) {
        super(game, 'setup');
        this.initialise([
            new SimpleStep(game, () => this.prepareDecks()),
            //Setup province prompt
            //Set out provinces
            //Attach stronghold
            new KeepOrMulliganPrompt(game),
            new SimpleStep(game, () => this.startGame()),
            new SetupCardsPrompt(game),
            new SimpleStep(game, () => this.setupDone()),
            new CheckAttachmentsPrompt(game)
        ]);
    }

    prepareDecks() {
        this.game.raiseEvent('onDecksPrepared');
        _.each(this.game.getPlayers(), player => {
            if(player.agenda) {
                player.agenda.play();
            }
        });
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
