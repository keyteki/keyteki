const PlotCard = require('../../../plotcard.js');

class CallingTheBanners extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                let otherPlayer = this.game.getOtherPlayer(this.controller);

                if(!otherPlayer) {
                    return;
                }

                let characterCount = otherPlayer.getNumberOfCardsInPlay(card => card.getType() === 'character');

                if(characterCount <= 0) {
                    return;
                }

                this.game.addMessage('{0} uses {1} to gain {2} gold', this.controller, this, characterCount);
                this.game.addGold(this.controller, characterCount);
            }
        });
    }
}

CallingTheBanners.code = '01007';

module.exports = CallingTheBanners;
