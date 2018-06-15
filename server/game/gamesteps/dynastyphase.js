const _ = require('underscore');

const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const DynastyActionWindow = require('./dynasty/dynastyactionwindow.js');

/*
I Dynasty Phase
1.1 Dynasty phase begins.
1.2 Reveal facedown dynasty cards.
1.3 Collect fate.
1.4 SPECIAL ACTION WINDOW
    Players alternate playing cards from
    provinces and/or triggering Action abilities.
1.5 Dynasty phase ends.
 */

class DynastyPhase extends Phase {
    constructor(game) {
        super(game, 'dynasty');
        this.initialise([
            new SimpleStep(game, () => this.beginDynasty()),
            new SimpleStep(game, () => this.flipDynastyCards()),
            new SimpleStep(game, () => this.dynastyActionWindowStep())
        ]);
    }

    beginDynasty() {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            player.beginDynasty();
        });
    }

    flipDynastyCards () {
        _.each(this.game.getPlayersInFirstPlayerOrder(), player => {
            this.game.queueSimpleStep(() => player.flipDynastyCards());
        });
    }

    dynastyActionWindowStep() {
        this.game.queueStep(new DynastyActionWindow(this.game));
    }

}

module.exports = DynastyPhase;
