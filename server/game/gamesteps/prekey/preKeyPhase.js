const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');

class preKeyPhase extends Phase {
    constructor(game) {
        super(game, 'preKey');
        this.initialise([
            new SimpleStep(game, () => this.preKey())
        ]);
    }

    preKey() {

    }
}

module.exports = preKeyPhase;
