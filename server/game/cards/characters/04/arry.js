const DrawCard = require('../../../drawcard.js');

class Arry extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return Arry to your hand and draw 1 card',
            method: 'return'
        });
    }

    return(player) {
        player.moveCard(this, 'hand');
        player.drawCardsToHand(1);

        this.game.addMessage('{0} returns {1} to their hand and draws 1 card', player, this);

        return true;
    }
}

Arry.code = '04006';

module.exports = Arry;
