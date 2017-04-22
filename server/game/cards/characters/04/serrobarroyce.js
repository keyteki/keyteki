const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class SerRobarRoyce extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlotsRevealed: event => _.any(event.plots, plot => plot.hasTrait('Summer'))
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                this.modifyPower(1),
                this.game.addMessage('{0} uses {1} to gain a power on {1}', this.controller, this);
            }
        });

        this.forcedReaction({
            when: {
                onPlotsRevealed: event => _.any(event.plots, plot => plot.hasTrait('Winter'))
            },
            handler: () => {
                this.controller.kneelCard(this),
                this.game.addMessage('{0} is forced by {1} to kneel {1}', this.controller, this);
            }
        });
    }
}

SerRobarRoyce.code = '04103';

module.exports = SerRobarRoyce;
