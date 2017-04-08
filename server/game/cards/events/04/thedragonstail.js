const DrawCard = require('../../../drawcard.js');

class TheDragonsTail extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Both you and opponent draw 2 cards',
            handler: () => {
                let opponent = this.game.getOtherPlayer(this.controller);

                if(!opponent) {
                    return;
                }

                this.controller.drawCardsToHand(2);
                opponent.drawCardsToHand(2);

                this.game.addMessage('{0} uses {1} to make both players draw 2 cards',
                                    this.controller, this);
            }
        });
    }
}

TheDragonsTail.code = '04001';

module.exports = TheDragonsTail;
