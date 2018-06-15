const ProvinceCard = require('../../provincecard.js');

class SecretCache extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Look at top 5 cards',
            when: {
                onConflictDeclared: event => event.conflict.conflictProvince === this
            },
            handler: () => {
                let myTopFive = this.controller.conflictDeck.first(5);
                if(myTopFive.length > 1) {
                    this.game.addMessage('{0} uses {1} to look at the top {2} cards of their conflict deck', this.controller, this, myTopFive.length);
                    this.game.promptWithHandlerMenu(this.controller, {
                        source: this,
                        activePromptTitle: 'Choose a card',
                        cards: myTopFive,
                        cardHandler: card => {
                            this.game.addMessage('{0} takes a card into their hand', this.controller);
                            this.controller.moveCard(card, 'hand');
                            this.controller.shuffleConflictDeck();                    
                        }
                    });
                } else {
                    this.game.addMessage('{0} uses {1} to take the last card from their conflict deck into their hand', this.controller, this);
                    this.controller.drawCardsToHand(1);
                }
            }
        });
    }
}

SecretCache.id = 'secret-cache';

module.exports = SecretCache;
