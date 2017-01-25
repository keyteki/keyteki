const _ = require('underscore');
const Phase = require('./phase.js');
const SimpleStep = require('./simplestep.js');
const SelectPlotPrompt = require('./plot/selectplotprompt.js');
const FirstPlayerPrompt = require('./plot/firstplayerprompt.js');
const ResolvePlots = require('./plot/resolveplots.js');

class PlotPhase extends Phase {
    constructor(game) {
        super(game, 'plot');
        this.initialise([
            new SimpleStep(game, () => this.startPlotPhase()),
            new SelectPlotPrompt(game),
            new SimpleStep(game, () => this.flipPlotsFaceup()),
            new SimpleStep(game, () => this.determineInitiative()),
            () => new FirstPlayerPrompt(game, this.initiativeWinner),
            () => new ResolvePlots(game, this.getPlayersWithRevealEffects()),
            new SimpleStep(game, () => this.resolveRemainingPlots()),
            new SimpleStep(game, () => this.completePlotReveal())
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

    determineInitiative() {
        var initiativeWinner = undefined;
        var highestInitiative = -1;
        var lowestPower = -1;

        _.each(this.game.getPlayers(), p => {
            var playerInitiative = p.getTotalInitiative();
            var playerPower = p.getTotalPower();

            if(playerInitiative === highestInitiative) {
                if(playerPower === lowestPower) {
                    var randomNumber = _.random(0, 1);
                    if(randomNumber === 0) {
                        highestInitiative = playerInitiative;
                        lowestPower = playerPower;
                        initiativeWinner = p;
                    }
                }

                if(playerPower < lowestPower) {
                    highestInitiative = playerInitiative;
                    lowestPower = playerPower;
                    initiativeWinner = p;
                }
            }

            if(playerInitiative > highestInitiative) {
                highestInitiative = playerInitiative;
                lowestPower = playerPower;
                initiativeWinner = p;
            }
        });

        this.initiativeWinner = initiativeWinner;
        this.game.raiseEvent('onInitiativeDetermined', initiativeWinner);
    }

    getPlayersWithRevealEffects() {
        return _.filter(this.game.getPlayers(), player => player.activePlot.hasRevealEffect());
    }

    resolveRemainingPlots() {
        var playersWithoutRevealEffects = _.reject(this.game.getPlayers(), player => player.activePlot.hasRevealEffect());
        _.each(playersWithoutRevealEffects, player => {
            this.game.raiseEvent('onPlotRevealed', player);
        });
    }

    completePlotReveal() {
        this.game.raiseEvent('onPlotRevealCompleted');
    }
}

module.exports = PlotPhase;
