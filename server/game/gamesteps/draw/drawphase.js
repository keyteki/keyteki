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
            this.game.addMessage('{0} draws {1} cards for the draw phase', player, amount);
            this.game.actions.draw({ amount: amount }).resolve(player, this.game.getFrameworkContext());

        }
        player.modifyChains(-1);
    }

    roundEnded() {
        this.game.raiseEvent('onRoundEnded', {}, () => {
            if(this.game.activePlayer.opponent) {
                this.game.activePlayer = this.game.activePlayer.opponent;
            }
            this.game.activePlayer.endRound();
        });
    }
}

module.exports = DrawPhase;
