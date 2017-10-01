const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class ShrewdYasuki extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Look at top 2 cards of conflict deck',
            condition: () => {
                let otherPlayer = this.game.getOtherPlayer(this.controller);
                return (
                    this.game.currentConflict && 
                    this.game.currentConflict.isParticipating(this) && 
                    (this.controller.getNumberOfHoldingsInPlay() > 0 ||
                    (otherPlayer && otherPlayer.getNumberOfHoldingsInPlay() > 0))
                ); 
            },
            handler: () => {
                this.game.addMessage('{0} uses {1} to look at the top two cards of their conflict deck', this.controller, this);
                let buttons = _.map(this.controller.conflictDeck.first(2), card => {
                    return { text: card.name, arg: card.uuid, method: 'takeCardToHand' };
                });
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Choose a card to put in your hand',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });        
    }
    
    takeCardToHand(player, arg) {
        this.game.addMessage('{0} takes one card to their hand and puts the other on the bottom of their deck', this.controller);
        let card = player.findCardByUuid(player.conflictDeck, arg);
        player.moveCard(card, 'hand');
        player.moveFromTopToBottomOfConflictDrawDeck(1);
        return true;
    }
}

ShrewdYasuki.id = 'shrewd-yasuki';

module.exports = ShrewdYasuki;
