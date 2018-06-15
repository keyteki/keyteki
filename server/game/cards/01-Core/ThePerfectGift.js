const DrawCard = require('../../drawcard.js');

class ThePerfectGift extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Give each player a gift',
            condition: context => context.player.conflictDeck.size() > 0 || (context.player.opponent && context.player.opponent.conflictDeck.size() > 0),
            effect: 'give each player a gift',
            handler: context => {
                let otherPlayer = context.player.opponent;
                let myTopFour = context.player.conflictDeck.first(4);
                let n = myTopFour.length;
                this.game.addMessage('{0} reveals the top {1} from their conflict deck: {2}', context.player, n > 1 ? n + ' cards' : 'card', myTopFour);
                if(otherPlayer) {
                    let opponentTopFour = otherPlayer.conflictDeck.first(4);
                    n = opponentTopFour.length;
                    if(n > 0) {
                        this.game.addMessage('{0} reveals the top {1} from their conflict deck: {2}', otherPlayer, n > 1 ? n + ' cards' : 'card', opponentTopFour);
                        this.game.promptWithHandlerMenu(context.player, {
                            activePromptTitle: 'Choose a card to give your opponent',
                            context: context,
                            cards: opponentTopFour,
                            cardHandler: card => {
                                this.game.addMessage('{0} chooses {1} to give {2}', context.player, card, otherPlayer);
                                otherPlayer.moveCard(card, 'hand');
                                otherPlayer.shuffleConflictDeck();
                            }
                        });
                    }
                }
                this.game.queueSimpleStep(() => this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Choose a card to give your yourself',
                    context: context,
                    cards: myTopFour,
                    cardHandler: card => {
                        this.game.addMessage('{0} chooses {1} to give themself', context.player, card);
                        context.player.moveCard(card, 'hand');
                        context.player.shuffleConflictDeck();
                    }
                }));
            }
        });
    }
}

ThePerfectGift.id = 'the-perfect-gift';

module.exports = ThePerfectGift;
