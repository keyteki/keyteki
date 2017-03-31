const DrawCard = require('../../../drawcard.js');

class AshaGreyjoy extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => this.controller === challenge.winner && challenge.isParticipating(this) && challenge.isUnopposed()
            },
            handler: () => {
                this.controller.standCard(this);
                this.game.addMessage('{0} uses {1} to stand {1}', this.controller, this, this);
            }
        });
    }
}

AshaGreyjoy.code = '01067';

module.exports = AshaGreyjoy;
