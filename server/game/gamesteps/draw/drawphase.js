import Phase from '../phase.js';
import SimpleStep from '../simplestep.js';

class DrawPhase extends Phase {
    constructor(game) {
        super(game, 'draw');
        this.initialise([new SimpleStep(game, () => this.drawCards())]);
    }

    drawCards() {
        this.game.actions
            .draw({ refill: true })
            .resolve(this.game.activePlayer, this.game.getFrameworkContext());
    }
}

export default DrawPhase;
