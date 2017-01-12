const PlotCard = require('../../../plotcard.js');

class CallingTheBanners extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);

                if(!otherPlayer) {
                    return;
                }

                var characterCount = otherPlayer.cardsInPlay.reduce((memo, card) => {
                    var count = memo;

                    if(card.getType() === 'character') {
                        count++;
                    }

                    return count;
                }, 0);

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
