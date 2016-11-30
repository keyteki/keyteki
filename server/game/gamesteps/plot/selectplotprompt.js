const AllPlayerPrompt = require('../allplayerprompt.js');

class SelectPlotPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        return !!player.selectedPlot;
    }

    activePrompt() {
        return {
            menuTitle: 'Select a plot',
            buttons: [
                { command: 'menuButton', arg: 'plotselected', text: 'Done' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to select plot' };
    }

    onMenuCommand(player, plotId) {
        if(!player.selectPlot(plotId)) {
            return;
        }
        
        this.game.addMessage('{0} has selected a plot', player);
    }
}

module.exports = SelectPlotPrompt;
