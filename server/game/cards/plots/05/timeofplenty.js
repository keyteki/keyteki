const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class TimeOfPlenty extends PlotCard {
    flipFaceup() {
        super.flipFaceup();

        _.each(this.game.getPlayers(), player => {
            player.drawPhaseCards++;
        });

        this.game.addMessage('{0} uses {1} to increase the number of cards each player draws in the draw phase by 1', this.owner, this);
    }
}

TimeOfPlenty.code = '05051';

module.exports = TimeOfPlenty;
