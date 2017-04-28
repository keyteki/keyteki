const DrawCard = require('../../../drawcard.js');

class NorthernRookery extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to draw 1 card.', this.controller, this);
                this.controller.drawCardsToHand(1);
            }
        });
    }
}

NorthernRookery.code = '02086';

module.exports = NorthernRookery;
