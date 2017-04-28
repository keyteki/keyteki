const DrawCard = require('../../../drawcard.js');

class LittleFinger extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            handler: () => {
                this.controller.drawCardsToHand(2);
                this.game.addMessage('{0} uses {1} to draw 2 cards', this.controller, this);
            }
        });
        this.plotModifiers({
            gold: 1
        });
    }
}

LittleFinger.code = '01028';

module.exports = LittleFinger;
