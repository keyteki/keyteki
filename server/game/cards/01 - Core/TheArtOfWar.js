const _ = require('underscore');
const ProvinceCard = require('../../provincecard.js');

class TheArtOfWar extends ProvinceCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onBreakProvince: event => event.province === this
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to draw 3 cards', this.controller, this);
                this.controller.drawCardsToHand(3);
            }
        });
    }
}

TheArtOfWar.id = 'the-art-of-war';

module.exports = TheArtOfWar;
