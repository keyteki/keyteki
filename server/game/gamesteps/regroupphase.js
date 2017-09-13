const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const ActionWindow = require('./actionwindow.js');
const EndRoundPrompt = require('./regroup/endroundprompt.js');
const DiscardFromProvincesPrompt = require('./regroup/discardfromprovincesprompt.js');

/*
V Regroup Phase
5.1 Regroup phase begins.
    ACTION WINDOW
5.2 Ready cards.
5.3 Discard from provinces.
5.4 Return rings.
5.5 Pass first player token.
5.6 Regroup phase ends.
 */

class RegroupPhase extends Phase {
    constructor(game) {
        super(game, 'regroup');
        this.initialise([
            new ActionWindow(this.game, 'After regroup phase begins', 'beginning'),
            new SimpleStep(game, () => this.readyCards()),
            new SimpleStep(game, () => this.discardFromProvinces()),
            new SimpleStep(game, () => this.returnRings()),
            new SimpleStep(game, () => this.passFirstPlayer()),
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
    
    discardFromProvinces() {
        _.each(this.game.getPlayers(), player => {
            player.discardFromBrokenProvinces();
            this.game.queueStep(new DiscardFromProvincesPrompt(this.game, player));
        });
    }
    
    returnRings() {
        this.game.raiseEvent('onReturnRings', this.game, this.game.returnRings);
    }

    passFirstPlayer() {
        this.allPlayers = this.game.getPlayersInFirstPlayerOrder();
        let firstPlayer = this.allPlayers.shift();
        let secondPlayer = this.allPlayers.shift();

        firstPlayer.firstPlayer = false;
        secondPlayer.firstPlayer = true;
    }

    roundEnded() {
        this.game.raiseEvent('onRoundEnded');
    }

}

module.exports = RegroupPhase;
