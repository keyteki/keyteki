const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const SelectPlotPrompt = require('./plot/selectplotprompt.js');
const RevealPlots = require('./revealplots.js');

class PlotPhase extends Phase {
    constructor(game) {
        super(game, 'plot');
        this.initialise([
            new SimpleStep(game, () => this.startPlotPhase()),
            new SelectPlotPrompt(game),
            new SimpleStep(game, () => this.flipPlotsFaceup()),
            () => new RevealPlots(game, _.map(this.game.getPlayers(), player => player.activePlot)),
            new SimpleStep(game, () => this.recyclePlots())
        ]);
    }

    startPlotPhase() {
        _.each(this.game.getPlayers(), player => {
            player.startPlotPhase();
        });
    }

    flipPlotsFaceup() {
        this.game.raiseEvent('onPlotFlip', () => {
            _.each(this.game.getPlayers(), player => {
                player.flipPlotFaceup();
            });
        });
    }

    recyclePlots() {
        _.each(this.game.getPlayers(), player => {
            player.recyclePlots();
        });
    }
}

module.exports = PlotPhase;
