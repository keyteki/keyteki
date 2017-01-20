const DrawCard = require('../../../drawcard.js');

class LordsportFisherman extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (e, card) => card === this && this.game.currentPhase === 'marshal'
            },
            handler: () => {
                var bottomCard = this.controller.drawDeck.last();
                this.controller.moveCard(bottomCard, 'hand');
            }
        });
    }
}

LordsportFisherman.code = '04051';

module.exports = LordsportFisherman;
