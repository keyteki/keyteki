const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');

class StandingPhase extends Phase {
    constructor(game) {
        super(game, 'standing');
        this.initialise([
            new SimpleStep(game, () => this.standCards()),
            new SimpleStep(game, () => this.endPhase())
        ]);
    }

    standCards() {
        this.game.raiseEvent('cardsStanding');

        _.each(this.game.getPlayers(), player => {
            player.standCards();
        });
    }

    endPhase() {
        this.game.raiseEvent('onPhaseEnd', 'standing');
    }    
}

module.exports = StandingPhase;
