const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class ThePerfectGift extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'The Perfect Gift',
            handler: () => {
                let otherPlayer = this.game.getOtherPlayer(this.controller);
                let opponentTopFour = [];
                let myTopFour = this.controller.conflictDeck.first(4);
                let n = myTopFour.length;
                this.game.addMessage('{0) reveals the top {1} from their conflict deck: {2}', this.controller, n > 1 ? n + ' cards' : 'card', myTopFour);
                if(otherPlayer) {
                    opponentTopFour = otherPlayer.conflictDeck.first(4);
                    n = opponentTopFour.length;
                    if(n > 0) {
                        this.game.addMessage('{0) reveals the top {1} from their conflict deck: {2}', otherPlayer, n > 1 ? n + ' cards' : 'card', opponentTopFour);
                        this.game.promptWithMenu(this.controller, this, {
                            source: this,
                            activePrompt: { 
                                menuTitle: 'Choose a card to give your opponent' ,
                                buttons: _.map(opponentTopFour, card => {
                                    return { text: card.name, arg: card.uuid, method: 'pickOppCard' };
                                })
                            }
                        });
                        return;
                    }
                }
                this.pickOppCard(this.controller, '');
            }
        });
    }
    
    pickOppCard (player, arg) {
        if(arg) {
            let otherPlayer = this.game.getOtherPlayer(player);
            let card = otherPlayer.findCardByUuid(otherPlayer.conflictDeck, arg);
            otherPlayer.moveCard(card, 'hand');
            this.game.addMessage('{0} chooses {1} to give {2}', player, card, otherPlayer);
            otherPlayer.shuffleConflictDeck();
        }
        let myTopFour = this.controller.conflictDeck.first(4);
        if(myTopFour.length > 0) {
            this.game.promptWithMenu(this.controller, this, {
                source: this,
                activePrompt: { 
                    menuTitle: 'Choose a card to give your yourself' ,
                    buttons: _.map(myTopFour, card => {
                        return { text: card.name, arg: card.uuid, method: 'pickMyCard' };
                    })
                }
            });
        }
        return true;
    }
    
    pickMyCard (player, arg) {
        let card = player.findCardByUuid(player.conflictDeck, arg);
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} chooses {1} to give themself', player, card);
        player.shuffleConflictDeck();
        return true;
    }
}

ThePerfectGift.id = 'the-perfect-gift';

module.exports = ThePerfectGift;
