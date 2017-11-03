const _ = require('underscore');
const ProvinceCard = require('../../provincecard.js');

class SecretCache extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onConflictDeclared: event => event.conflict.conflictProvince === this
            },
            handler: () => {
                let myTopFive = this.controller.conflictDeck.first(5);
                if(myTopFive.length > 0) {
                    this.game.addMessage('{0} uses {1} to look at the top {2} of their conflict deck', 
                        this.controller, this, myTopFive.length > 1 ? myTopFive.length + ' cards' : 'card');
                    this.game.promptWithMenu(this.controller, this, {
                        source: this,
                        activePrompt: { 
                            menuTitle: 'Choose a card to take from your Secret Cache',
                            buttons: _.map(myTopFive, card => {
                                return { text: card.name, arg: card.uuid, method: 'pickMyCard' };
                            })
                        }
                    });
                } else {
                    this.game.addMessage('{0} uses {1}, but there are no more cards remaining in their conflict deck!', this.controller, this);
                }
            }
        });
    }

    pickMyCard (player, arg) {
        let card = player.findCardByUuid(player.conflictDeck, arg);
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} takes a card into their hand', player);
        player.shuffleConflictDeck();
        return true;
    }
}

SecretCache.id = 'secret-cache';

module.exports = SecretCache;
