const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');

class DrawPhase extends Phase {
    constructor(game) {
        super(game, 'draw');
        this.initialise([new SimpleStep(game, () => this.drawCards())]);
    }

    getPhaseEndedEvent() {
        let event = super.getPhaseStartedEvent();
        event.addChildEvent(this.getEndTurnEvent());
        return event;
    }

    getEndTurnEvent() {
        return this.game.getEvent('atEndOfTurn', {}, () => this.game.endRound());
    }

    skipPhase() {
        this.game.openEventWindow(this.getEndTurnEvent());
    }

    drawCards() {
        this.game.actions
            .draw({ refill: true })
            .resolve(this.game.activePlayer, this.game.getFrameworkContext());
    }
}

module.exports = DrawPhase;
