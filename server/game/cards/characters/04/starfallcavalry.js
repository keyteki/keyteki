const DrawCard = require('../../../drawcard.js');

class StarfallCavalry extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            handler: () => {
                var numCards = this.controller.getNumberOfUsedPlots() >= 3 ? 3 : 1;

                this.controller.drawCardsToHand(numCards);

                this.game.addMessage('{0} uses {1} to draw {2} card{3}', this.controller, this, numCards, numCards > 1 ? 's' : '');
            }
        });
    }
}

StarfallCavalry.code = '04035';

module.exports = StarfallCavalry;
