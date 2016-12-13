const _ = require('underscore');

const BaseStep = require('../basestep.js');

class ResolvePlots extends BaseStep {
    constructor(game, playersWithRevealEffects) {
        super(game);
        this.playersWithRevealEffects = playersWithRevealEffects;
    }

    continue() {
        if(this.playersWithRevealEffects.length > 1) {
            this.promptForOrder(this.playersWithRevealEffects);
            return false;
        }

        _.each(this.playersWithRevealEffects, player => {
            player.revealPlot();
        });

        return true;
    }

    promptForOrder() {
        this.game.promptWithMenu(this.game.getFirstPlayer(), this, {
            activePrompt: {
                menuTitle: 'Select a player to resolve their plot effects',
                buttons: _.map(this.playersWithRevealEffects, player => {
                    return { command: 'menuButton', method: 'resolvePlayer', text: player.name, arg: player.id };
                })
            },
            waitingPromptTitle: 'Waiting for first player to choose plot resolution order'
        });
    }

    resolvePlayer(firstPlayer, playerId) {
        var player = this.game.getPlayerById(playerId);

        if(!player) {
            return false;
        }

        this.playersWithRevealEffects = _.reject(this.playersWithRevealEffects, p => p === player);
        player.revealPlot();

        return true;
    }
}

module.exports = ResolvePlots;
