const AllPlayerPrompt = require('../allplayerprompt.js');

class SelectPlotPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        return !!player.selectedPlot;
    }

    activePrompt() {
        return {
            menuTitle: 'Select a plot',
            buttons: [
                { arg: 'plotselected', text: 'Done' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to select plot' };
    }

    onMenuCommand(player) {
        var plot = player.findCard(player.plotDeck, card => {
            return card.selected;
        });

        if(!plot) {
            return;
        }

        plot.facedown = true;
        plot.selected = false;
        player.selectedPlot = plot;

        this.game.addMessage('{0} has selected a plot', player);
    }
}

module.exports = SelectPlotPrompt;
