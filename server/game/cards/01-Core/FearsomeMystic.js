const _ = require('underscore');
const DrawCard = require('../../drawcard.js');
const RemoveFateEvent = require('../../Events/RemoveFateEvent.js');

class FearsomeMystic extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictRing === 'air',
            effect: ability.effects.modifyGlory(2)
        });
        this.action({
            title: 'Remove fate from characters',
            condition: () => this.game.currentConflict && this.game.currentConflict.isParticipating(this),
            handler: context => {
                this.game.addMessage('{0} uses {1} to remove 1 fate from all opposing characters with lower glory than her', this.controller, this);
                let cards = this.game.findAnyCardsInPlay(card => {
                    return (card.isParticipating() && 
                            card.controller !== this.controller && 
                            card.getGlory() < this.getGlory() && 
                            card.fate > 0 &&
                            card.allowGameAction('removeFate', context));
                });
                this.game.openEventWindow(_.map(cards, card => {
                    return new RemoveFateEvent({
                        card: card,
                        fate: 1
                    });
                }));
            }
        });
    }
}

FearsomeMystic.id = 'fearsome-mystic';

module.exports = FearsomeMystic;
