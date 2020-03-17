const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');

class CleanupPhase extends Phase {
    constructor(game) {
        super(game, 'cleanup');
        this.initialise([]);
    }
}

module.exports = CleanupPhase;
