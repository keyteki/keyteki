const Phase = require('../phase.js');
const ActionWindow = require('./actionwindow.js');

class MainPhase extends Phase {
    constructor(game) {
        super(game, 'play');
        this.initialise([
            new ActionWindow(game)
        ]);
    }
}

module.exports = MainPhase;
