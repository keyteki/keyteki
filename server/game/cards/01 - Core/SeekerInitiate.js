const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class SeekerInitiate extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onClaimRing: event => this.controller.role.hasTrait(event.conflict.conflictRing)
            },
            handler: () => {
                let myTopFive = this.controller.conflictDeck.first(5);
                if(myTopFive.length > 1) {
                    this.game.addMessage('{0} uses {1} to look at the top {2} cards of their conflict deck', this.controller, this, myTopFive.length);
                    this.game.promptWithMenu(this.controller, this, {
                        source: this,
                        activePrompt: { 
                            menuTitle: 'Choose a card to take with your Seeker Initiate',
                            buttons: _.map(myTopFive, card => {
                                return { text: card.name, arg: card.uuid, method: 'pickMyCard' };
                            })
                        }
                    });
                } else if(myTopFive.length === 1) {
                    this.game.addMessage('{0} uses {1} to take the last card from their conflict deck into their hand', this.controller, this);
                    this.controller.drawCardsToHand(1);
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

SeekerInitiate.id = 'seeker-initiate';

module.exports = SeekerInitiate;
