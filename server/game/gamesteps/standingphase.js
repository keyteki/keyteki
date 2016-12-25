const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');

class StandingPhase extends Phase {
    constructor(game) {
        super(game, 'standing');
        this.initialise([
            new SimpleStep(game, () => this.standCards())
        ]);
    }

    standCards() {
        this.game.raiseEvent('cardsStanding');

        _.each(this.game.getPlayers(), player => {
            player.standCards();
        });
    }
}

module.exports = StandingPhase;
