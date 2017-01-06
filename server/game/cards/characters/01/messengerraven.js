const DrawCard = require('../../../drawcard.js');

class MessengerRaven extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return Messanger Raven to your hand and draw 1 card',
            method: 'return',
            phase: 'dominance'
        });
    }

    return(player) {
        player.moveCard(this, 'hand');
        player.drawCardsToHand(1);

        this.game.addMessage('{0} returns {1} to their hand and draws 1 card', player, this);

        return true;
    }
}

MessengerRaven.code = '01130';

module.exports = MessengerRaven;
