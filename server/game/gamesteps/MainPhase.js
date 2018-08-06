const Phase = require('./phase.js');
const ActionWindow = require('./actionwindow.js');

class DrawPhase extends Phase {
    constructor(game) {
        super(game, 'draw');
        this.initialise([
            new ActionWindow(game)
        ]);
    }
}

module.exports = DrawPhase;
