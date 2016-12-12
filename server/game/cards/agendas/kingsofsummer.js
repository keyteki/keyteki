const _ = require('underscore');

const AgendaCard = require('../../agendacard.js');

class KingsOfSummer extends AgendaCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPlotFlip']);
    }

    onPlotFlip() {
        var wasWinter = false;

        _.each(this.game.getPlayers(), player => {
            if(player.activePlot) {
                player.activePlot.reserveModifier--;

                if(player.activePlot.hasTrait('Winter')) {
                    wasWinter = true;
                }
            }

            player.selectedPlot.reserveModifier++;
        });

        if(!wasWinter && this.controller.activePlot && this.controller.activePlot.hasTrait('Summer')) {
            this.controller.activePlot.goldModifier--;
        }

        if(!_.any(this.game.getPlayers(), player => {
            return player.selectedPlot.hasTrait('Winter');
        }) && this.controller.selectedPlot.hasTrait('Summer')) {
            this.controller.selectedPlot.goldModifier++;

            this.game.addMessage('{0} uses {1} to add 1 gold to their revealed plot as there are no Winter plot cards revealed', this.controller, this);
        }
    }
}

KingsOfSummer.code = '04037';

module.exports = KingsOfSummer;
