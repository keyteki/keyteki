const DrawCard = require('../../../drawcard.js');

class TheMander extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    challenge.strengthDifference >= 5)
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.controller.drawCardsToHand(2);
                this.game.addMessage('{0} uses {1} to draw 2 cards', this.controller, this);
            }
        });
    }
}

TheMander.code = '01193';

module.exports = TheMander;
