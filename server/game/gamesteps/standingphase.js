const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const ActionWindow = require('./actionwindow.js');

class StandingPhase extends Phase {
    constructor(game) {
        super(game, 'standing');
        this.initialise([
            new SimpleStep(game, () => this.standCards()),
            new ActionWindow(this.game, 'After cards stand')
        ]);
    }

    standCards() {
        this.game.raiseEvent('onStandAllCards', () => {
            _.each(this.game.getPlayers(), player => {
                player.standCards();
            });
        });
    }
}

module.exports = StandingPhase;
