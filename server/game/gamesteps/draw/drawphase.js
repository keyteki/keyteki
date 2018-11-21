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
            this.game.actions.draw({ amount: amount }).resolve(player, this.game.getFrameworkContext());
        }
        if(amount >= 0 && player.chains > 0) {
            player.modifyChains(-1);
            this.game.addMessage('{0}\'s chains are reduced by 1 to {1}', player, player.chains);
        }
    }

    roundEnded() {
        this.game.raiseEvent('onRoundEnded', {}, () => {
            this.game.activePlayer.activeHouse = null;
            this.game.endRound();
            if(this.game.activePlayer.opponent) {
                this.game.activePlayer = this.game.activePlayer.opponent;
            }
        });
    }
}

module.exports = DrawPhase;
