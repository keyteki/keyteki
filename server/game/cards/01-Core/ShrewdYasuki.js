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
                let cards = this.controller.conflictDeck.first(2);
                let handlers = _.map(cards, card => {
                    return () => {
                        this.game.addMessage('{0} takes one card to their hand and puts the other on the bottom of their deck', this.controller);
                        this.controller.moveCard(card, 'hand');
                        this.game.queueSimpleStep(() => this.controller.moveFromTopToBottomOfConflictDrawDeck(1));
                    };
                });
                this.game.promptWithHandlerMenu(this.controller, {
                    activePromptTitle: 'Choose a card to put in your hand',
                    cards: cards,
                    handlers: handlers,
                    source: this
                });
            }
        });        
    }
}

ShrewdYasuki.id = 'shrewd-yasuki';

module.exports = ShrewdYasuki;
