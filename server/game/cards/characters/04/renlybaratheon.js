const DrawCard = require('../../../drawcard.js');

class RenlyBaratheon extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onInsight: (event, challenge, insightTrigger, drawn) => {
                    if(insightTrigger.controller !== this.controller) {
                        return false;
                    }
                    this.drawnCard = drawn;

                    // postpone the check about drawn card loyalty, to avoid
                    // leaking game state to the opponent
                    return true;
                }
            },
            handler: () => {
                if(this.drawnCard.isLoyal()) {
                    this.controller.drawCardsToHand(1);

                    this.game.addMessage('{0} uses {1} to reveal {2} and draw a card',
                                         this.controller, this, this.drawnCard);
                }
            }
        });
    }
}

RenlyBaratheon.code = '04043';

module.exports = RenlyBaratheon;
