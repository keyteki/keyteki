const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');

class KeyPhase extends Phase {
    constructor(game) {
        super(game, 'key');
        this.initialise([
            new SimpleStep(game, () => this.forgeKey())
        ]);
    }

    forgeKey() {
        if(this.game.activePlayer.canForgeKey()) {
            this.game.addMessage('{0} forges a key, paying {1} amber', this.game.activePlayer, this.game.activePlayer.getCurrentKeyCost());
            this.game.actions.forgeKey().resolve(this.game.activePlayer, this.game.getFrameworkContext(this.game.activePlayer));
        } else {
            this.game.addMessage('{0} does not have enough amber({1}) to forge a key (current cost:{2})', this.game.activePlayer, this.game.activePlayer.amber, this.game.activePlayer.getCurrentKeyCost());
        }
    }
}

module.exports = KeyPhase;
