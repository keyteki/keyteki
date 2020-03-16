const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');

class SupplyPhase extends Phase {
    constructor(game) {
        super(game, 'supply');
        this.initialise([
            new SimpleStep(game, () => this.drawCards()),
            new SimpleStep(game, () => this.refillMana())

        ]);
    }

    refillMana() {
        this.game.actions.gainMana().resolve(this.game.activePlayer, this.game.getFrameworkContext());
    }

    drawCards() {
        this.game.actions.draw().resolve(this.game.activePlayer, this.game.getFrameworkContext());
    }
}

module.exports = SupplyPhase;
