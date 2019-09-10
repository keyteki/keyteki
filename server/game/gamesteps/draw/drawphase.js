const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');

class DrawPhase extends Phase {
    constructor(game) {
        super(game, 'draw');
        this.initialise([
            new SimpleStep(game, () => this.drawCards()),
            new SimpleStep(game, () => this.roundEnded())
        ]);
    }

    drawCards() {
        let player = this.game.activePlayer;
        let amount = player.maxHandSize - player.hand.length;
        if(amount > 0) {
            this.game.addMessage('{0} draws {1} cards up to their maximum hand size of {2}', player, amount, player.maxHandSize);
        }

        this.game.actions.draw({ amount: amount, shedChains: true }).resolve(player, this.game.getFrameworkContext());
    }

    roundEnded() {
        this.game.raiseEvent('onRoundEnded', {}, () => {
            this.game.endRound();
        });
    }
}

module.exports = DrawPhase;
