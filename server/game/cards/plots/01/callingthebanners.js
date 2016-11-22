const PlotCard = require('../../../plotcard.js');

class CallingTheBanners extends PlotCard {
    onReveal(player) {
        if(!this.inPlay || this.owner !== player) {
            return true;
        }

        var otherPlayer = this.game.getOtherPlayer(player);

        if(!otherPlayer) {
            return true;
        }

        var characterCount = otherPlayer.cardsInPlay.reduce((memo, card) => {
            var count = memo;

            if(card.getType() === 'character') {
                count++;
            }

            return count;
        }, 0);

        if(characterCount <= 0) {
            return true;
        }

        this.game.addMessage('{0} uses {1} to gain {2} gold', player, this, characterCount);
        player.gold += characterCount;

        return true;
    }
}

CallingTheBanners.code = '01007';

module.exports = CallingTheBanners;
