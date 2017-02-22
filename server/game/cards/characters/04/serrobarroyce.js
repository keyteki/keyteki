const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class SerRobarRoyce extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPlotRevealCompleted: () => this.anyPlotHasTrait('Summer')
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                this.modifyPower(1),
                this.game.addMessage('{0} uses {1} to gain a power on {1}', this.controller, this);
            }
        });

        this.forcedReaction({
            when: {
                onPlotRevealCompleted: () => this.anyPlotHasTrait('Winter')
            },
            handler: () => {
                this.controller.kneelCard(this),
                this.game.addMessage('{0} is forced by {1} to kneel {1}', this.controller, this);
            }
        });
    }

    anyPlotHasTrait(trait) {
        return _.any(this.game.getPlayers(), player => 
            player.activePlot &&
            player.activePlot.hasTrait(trait));
    }
}

SerRobarRoyce.code = '04103';

module.exports = SerRobarRoyce;
