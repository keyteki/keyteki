const DrawCard = require('../../../drawcard.js');

// TODO: Immunity to card effects; "have not yet drawn cards this phase" check
class PleasureBarge extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            gold: -1
        });

        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            handler: () => {
                this.controller.drawCardsToHand(3);
                this.game.addMessage('{0} uses {1} to draw 3 cards', this.controller, this);
            }
        });
    }
}

PleasureBarge.code = '02006';

module.exports = PleasureBarge;
