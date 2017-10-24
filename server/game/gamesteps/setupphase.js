const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const MulliganDynastyPrompt = require('./setup/mulligandynastyprompt.js');
const MulliganConflictPrompt = require('./setup/mulliganconflictprompt.js');
const SetupProvincesPrompt = require('./setup/setupprovincesprompt.js');

class SetupPhase extends Phase {
    constructor(game) {
        super(game, 'setup');
        this.initialise([
            new SimpleStep(game, () => this.setupBegin()),
            new SimpleStep(game, () => this.chooseFirstPlayer()),
            new SimpleStep(game, () => this.attachStronghold()),
            new SetupProvincesPrompt(game),
            new SimpleStep(game, () => this.placeProvinces()),
            new SimpleStep(game, () => this.fillProvinces()),
            new SimpleStep(game, () => this.doDynastyMulligan()),
            new SimpleStep(game, () => this.doConflictMulligan()),
            new SimpleStep(game, () => this.startGame())
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
    
    chooseFirstPlayer() {
        let firstPlayer = this.game.getFirstPlayer();
        if(firstPlayer.opponent) {
            this.game.promptWithHandlerMenu(firstPlayer, {
                activePromptTitle: 'You won the flip. Do you want to be:',
                source: 'Choose First Player',
                choices: ['First Player', 'Second Player'],
                handlers: [
                    () => this.game.addFate(firstPlayer.opponent, 1), 
                    () => {
                        this.game.addFate(firstPlayer, 1);
                        this.game.setFirstPlayer(firstPlayer.opponent);
                    }
                ]
            });
        }
    }

    attachStronghold() {
        _.each(this.game.getPlayers(), player => {
            player.attachStronghold();
        });
    }

    placeProvinces() {
        _.each(this.game.getPlayers(), player => {
            player.placeProvinces();
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

    doDynastyMulligan() {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            this.game.queueStep(new MulliganDynastyPrompt(this.game, player));
        });
    }

    doConflictMulligan() {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            player.drawStartingHand();
            this.game.queueStep(new MulliganConflictPrompt(this.game, player));
        });
    }

    startGame() {
        _.each(this.game.getPlayers(), player => {
            player.startGame();
        });
    }
}

module.exports = SetupPhase;
