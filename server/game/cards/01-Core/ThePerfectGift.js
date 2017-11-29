const DrawCard = require('../../drawcard.js');

class ThePerfectGift extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give each player a gift',
            handler: () => {
                let otherPlayer = this.game.getOtherPlayer(this.controller);
                let opponentTopFour = [];
                let myTopFour = this.controller.conflictDeck.first(4);
                let n = myTopFour.length;
                this.game.addMessage('{0} reveals the top {1} from their conflict deck: {2}', this.controller, n > 1 ? n + ' cards' : 'card', myTopFour);
                if(otherPlayer) {
                    opponentTopFour = otherPlayer.conflictDeck.first(4);
                    n = opponentTopFour.length;
                    if(n > 0) {
                        this.game.addMessage('{0} reveals the top {1} from their conflict deck: {2}', otherPlayer, n > 1 ? n + ' cards' : 'card', opponentTopFour);
                        this.game.promptWithHandlerMenu(this.controller, {
                            activePromptTitle: 'Choose a card to give your opponent',
                            source: this,
                            cards: opponentTopFour,
                            cardHandler: card => {
                                this.game.addMessage('{0} chooses {1} to give {2}', this.controller, card, otherPlayer);
                                otherPlayer.moveCard(card, 'hand');
                                otherPlayer.shuffleConflictDeck();
                            }
                        });
                    }
                }
                this.game.queueSimpleStep(() => this.game.promptWithHandlerMenu(this.controller, {
                    activePromptTitle: 'Choose a card to give your yourself',
                    source: this,
                    cards: myTopFour,
                    cardHandler: card => {
                        this.game.addMessage('{0} chooses {1} to give themself', this.controller, card);
                        this.controller.moveCard(card, 'hand');
                        this.controller.shuffleConflictDeck();                    
                    }
                }));
            }
        });
    }
}

ThePerfectGift.id = 'the-perfect-gift';

module.exports = ThePerfectGift;
