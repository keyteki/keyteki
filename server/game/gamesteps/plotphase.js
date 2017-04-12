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
            new SimpleStep(game, () => this.completePlotReveal()),
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

    determineInitiative() {
        let result = this.getInitiativeResult();
        let initiativeWinner = result.player;

        if(!initiativeWinner) {
            return false;
        }

        if(result.powerTied) {
            this.game.addMessage('{0} was randomly selected to win initiative because both initiative values and power were tied', initiativeWinner);
        } else if(result.initiativeTied) {
            this.game.addMessage('{0} won initiative because initiative values were tied but {0} had the lowest power', initiativeWinner);
        } else {
            this.game.addMessage('{0} won initiative', initiativeWinner);
        }

        this.initiativeWinner = initiativeWinner;
        this.game.raiseEvent('onInitiativeDetermined', initiativeWinner);
    }

    getInitiativeResult(sampleFunc = _.sample) {
        let result = { initiativeTied: false, powerTied: false, player: undefined };
        let playerInitiatives = _.map(this.game.getPlayers(), player => {
            return { player: player, initiative: player.getTotalInitiative(), power: player.getTotalPower() };
        });
        let highestInitiative = _.max(_.pluck(playerInitiatives, 'initiative'));
        let potentialWinners = _.filter(playerInitiatives, p => p.initiative === highestInitiative);

        result.initiativeTied = potentialWinners.length > 1;

        if(result.initiativeTied) {
            let lowestPower = _.min(_.pluck(potentialWinners, 'power'));
            potentialWinners = _.filter(potentialWinners, p => p.power === lowestPower);
        }

        result.powerTied = potentialWinners.length > 1;

        if(potentialWinners.length > 0) {
            result.player = sampleFunc(potentialWinners).player;
        }

        return result;
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

    recyclePlots() {
        _.each(this.game.getPlayers(), player => {
            player.recyclePlots();
        });
    }
}

module.exports = PlotPhase;
