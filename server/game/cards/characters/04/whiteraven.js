const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class WhiteRaven extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                afterChallenge: (e, challenge) => challenge.loser === this.controller && challenge.challengeType === 'power'
            },
            handler: () => {
                this.game.addMessage('{0} is forced by {1} to sacrifice {1}', this.controller, this);
                this.controller.sacrificeCard(this);
            }
        });
        this.reaction({
            when: {
                onDominanceDetermined: (event, winner) => (
                    this.controller === winner && 
                    (this.anyPlotHasTrait('Summer') || this.anyPlotHasTrait('Winter')))
            },
            handler: () => {
                this.game.addPower(this.controller, 1);
                this.game.addMessage('{0} uses {1} to gain 1 power for their faction', this.controller, this);
            }
        });
    }

    anyPlotHasTrait(trait) {
        return _.any(this.game.getPlayers(), player => 
            player.activePlot &&
            player.activePlot.hasTrait(trait));
    }
}

WhiteRaven.code = '04008';

module.exports = WhiteRaven;
