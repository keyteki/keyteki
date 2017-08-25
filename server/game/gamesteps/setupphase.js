const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const MulliganDynastyPrompt = require('./setup/mulligandynastyprompt.js');
const MulliganConflictPrompt = require('./setup/mulliganconflictprompt.js');
const SetupProvincesPrompt = require('./setup/setupprovincesprompt.js');

class SetupPhase extends Phase {
    constructor(game) {
        super(game, 'setup');
        var players = _.filter(game.getPlayers(), player => !game.isSpectator(player));
        this.initialise([
            new SimpleStep(game, () => this.setupBegin()),
            new SimpleStep(game, () => this.prepareDecks()),
            new SetupProvincesPrompt(game),
            new SimpleStep(game, () => this.attachStronghold()),
            new SimpleStep(game, () => this.fillProvinces()),
            new MulliganDynastyPrompt(game, players[0]),
            new MulliganDynastyPrompt(game, players[1]),
            new MulliganConflictPrompt(game, players[0]),
            new MulliganConflictPrompt(game, players[1]),
            new SimpleStep(game, () => this.startGame()),
            new SimpleStep(game, () => this.setupDone())
        ]);
    }

    setupBegin() {
        _.each(this.game.getPlayers(), player => {
            player.setupBegin();
        });

        let allPlayersShuffled = _.shuffle(this.game.getPlayers());

        let firstPlayer = allPlayersShuffled.shift();
        firstPlayer.firstPlayer = true;
    }

    attachStronghold() {
        _.each(this.game.getPlayers(), player => {
            player.attachStronghold();
        });
    }

    fillProvinces() {
        _.each(this.game.getPlayers(), player => {
            player.fillProvinces();
        });
        this.game.allCards.each(card => {
            card.applyAnyLocationPersistentEffects();
        });
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
