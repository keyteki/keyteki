const _ = require('underscore');

const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const DynastyActionPrompt = require('./dynasty/dynastyactionprompt.js');
const DynastyActionOrPassPrompt = require('./dynasty/dynastyactionorpassprompt.js');

class DynastyPhase extends Phase {
    constructor(game) {
        super(game, 'dynasty');
        this.initialise([
            new SimpleStep(game, () => this.beginDynasty()),
            new SimpleStep(game, () => this.cyclePlayers()),
            new SimpleStep(game, () => this.dynastyActionOrPassStep())
            //new SimpleStep(game, () => this.dynastyEvaluatePrompt())
        ]);
    }

    beginDynasty() {
        this.allPlayers = this.game.getPlayersInFirstPlayerOrder();
        this.remainingPlayers = this.allPlayers;

        _.each(this.allPlayers, player => {
            player.beginDynasty();
            this.game.raiseEvent('onBeginDynasty', player);
        });

    }

    cyclePlayers () {

        if (typeof this.currentPlayer == 'undefined') {
            //Get First Player
            this.currentPlayer = this.remainingPlayers.shift();
        }


    }

    dynastyActionOrPassStep() {

        if (this.currentPlayer.passedDynasty != true ) {

            if (this.currentPlayer.passedDynasty == false) {
                this.game.queueStep(new DynastyActionOrPassPrompt(this.game, this.currentPlayer));
            }

        this.queueStep(this.dynastyEvaluatePrompt());
        }

    }

    dynastyEvaluatePrompt() {

        if (this.currentPlayer.dynastyStep == 'action'){
            this.game.queueStep(new DynastyActionPrompt(this.game, this.currentPlayer));
        } else {
            console.log("Passed action");
        }

    }
}

module.exports = DynastyPhase;
