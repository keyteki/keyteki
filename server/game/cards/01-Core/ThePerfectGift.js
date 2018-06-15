const DrawCard = require('../../drawcard.js');

class ThePerfectGift extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give each player a gift',
            condition: () => this.controller.conflictDeck.size() > 0 || (this.controller.opponent && this.controller.opponent.conflictDeck.size() > 0),
            handler: () => {
                let otherPlayer = this.controller.opponent;
                let myTopFour = this.controller.conflictDeck.first(4);
                let n = myTopFour.length;
                this.game.addMessage('{0} plays {1}, revealing the top {2} from their conflict deck: {3}', this.controller, this, n > 1 ? n + ' cards' : 'card', myTopFour);
                if(otherPlayer) {
                    let opponentTopFour = otherPlayer.conflictDeck.first(4);
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
