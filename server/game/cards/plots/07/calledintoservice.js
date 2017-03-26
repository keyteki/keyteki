const PlotCard = require('../../../plotcard.js');

class CalledIntoService extends PlotCard {
    setupCardAbilities() {
        this.whenRevealed({
            handler: () => {
                var topCard = this.controller.drawDeck.first();

                if(topCard.getType() === 'character') {
                    this.controller.putIntoPlay(topCard);
                    this.game.addMessage('{0} uses {1} to reveal {2} as the top card of their deck and put it into play', 
                                      this.controller, this, topCard);
                } else {
                    this.controller.drawCardsToHand(1);
                    this.game.addGold(this.controller, 2);
                    this.game.addMessage('{0} uses {1} to reveal {2} as the top card of their deck, draw it and gain 2 gold', 
                                      this.controller, this, topCard);
                }
            }
        });
    }
}

CalledIntoService.code = '07049';

module.exports = CalledIntoService;
