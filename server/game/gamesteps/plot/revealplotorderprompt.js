const _ = require('underscore');

const UIPrompt = require('../uiprompt.js');

class RevealPlotOrderPrompt extends UIPrompt {
    constructor(game, player) {
        super(game);

        this.player = player;
    }

    activeCondition(player) {
        return player === this.player;
    }

    activePrompt() {
        var playersWithRevealEffects = _.find(this.game.getPlayers, player => {
            return player.activePlot.hasRevealEffect();
        });

        return {
            menuTitle: 'Select a player to resolve their plot effects',
            buttons: _.map(playersWithRevealEffects, player => {
                return { text: player.name, command: 'menuButton', arg: player.id };
            })
        };
    }

    onMenuCommand(player, playerId) {
        if(player !== this.player) {
            return false;
        }     
    }

    continue() {
        this.setPrompt();

        return false;
    }
}

module.exports = RevealPlotOrderPrompt;
