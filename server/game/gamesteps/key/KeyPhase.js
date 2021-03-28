const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');

class KeyPhase extends Phase {
    constructor(game) {
        super(game, 'key');
        this.initialise([new SimpleStep(game, () => this.forgeKey())]);
    }

    forgeKey() {
        if (this.game.activePlayer.canForgeKey()) {
            this.game.actions
                .forgeKey()
                .resolve(
                    this.game.activePlayer,
                    this.game.getFrameworkContext(this.game.activePlayer)
                );
        } else {
            this.game.addMessage(
                '{0} does not forge a key.  They have {1} amber.  The current cost is {2} amber ',
                this.game.activePlayer,
                this.game.activePlayer.amber,
                this.game.activePlayer.getCurrentKeyCost()
            );
        }
    }
}

module.exports = KeyPhase;
