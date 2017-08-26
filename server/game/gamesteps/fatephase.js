const Phase = require('./phase.js');
const ActionWindow = require('./actionwindow.js');
//const SimpleStep = require('./simplestep.js');

/*
IV Fate Phase
4.1 Fate phase begins.
4.2 Discard characters with no fate.
4.3 Remove fate from characters.
4.4 Place fate on unclaimed rings.
    ACTION WINDOW
4.5 Fate phase ends.
 */

class FatePhase extends Phase {
    constructor(game) {
        super(game, 'fate');
        this.initialise([
            new ActionWindow(this.game, 'After place fate on rings', 'placing')
        ]);
    }


}

module.exports = FatePhase;
