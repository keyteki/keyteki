const DrawCard = require('../../../drawcard.js');

class LordsportFisherman extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            handler: () => {
                var bottomCard = this.controller.drawDeck.last();
                this.controller.moveCard(bottomCard, 'hand');

                this.game.addMessage('{0} uses {1} to draw the bottom card of their deck',
                                     this.controller, this);
            }
        });
    }
}

LordsportFisherman.code = '04051';

module.exports = LordsportFisherman;
