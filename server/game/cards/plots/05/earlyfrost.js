const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class EarlyFrost extends PlotCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPlotFlip']);
    }

    onPlotFlip() {
        _.each(this.game.getPlayers(), player => {
            player.drawPhaseCards--;
        });

        this.game.addMessage('{0} uses {1} to reduce the number of cards each player draws in the draw phase by 1', this.owner, this);
    }
}

EarlyFrost.code = '05052';

module.exports = EarlyFrost;
