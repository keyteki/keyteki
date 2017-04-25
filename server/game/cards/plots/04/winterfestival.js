const _ = require('underscore');

const PlotCard = require('../../../plotcard.js');

class WinterFestival extends PlotCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onPhaseEnded: (event, phase) => {
                    if(phase !== 'challenge') {
                        return false;
                    }

                    if(_.any(this.game.getPlayers(), player => {
                        return player.activePlot.hasTrait('Summer');
                    })) {
                        return false;
                    }

                    return true;
                }
            },
            handler: () => {
                this.game.addPower(this.controller, 2);

                this.game.addMessage('{0} gains 2 power from {1}', this.controller, this);
            }
        });
    }
}

WinterFestival.code = '04040';

module.exports = WinterFestival;
