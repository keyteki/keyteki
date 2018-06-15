const DrawCard = require('../../drawcard.js');

class FearsomeMystic extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            condition: () => this.game.currentConflict && this.game.currentConflict.hasElement('air'),
            effect: ability.effects.modifyGlory(2)
        });
        this.action({
            title: 'Remove fate from characters',
            condition: context => this.isParticipating() && this.controller.opponent && 
                                  this.controller.opponent.cardsInPlay.any(card => card.isParticipating() && card.fate > 0 && 
                                                                                   card.getGlory() < this.getGlory() && card.allowGameAction('removeFate', context)),
            handler: context => {
                this.game.addMessage('{0} uses {1} to remove 1 fate from all opposing characters with lower glory than her', this.controller, this);
                this.game.applyGameAction(context, { removeFate: this.game.findAnyCardsInPlay(card => (card.isParticipating() && 
                            card.controller !== this.controller && 
                            card.getGlory() < this.getGlory() && 
                            card.fate > 0 &&
                            card.allowGameAction('removeFate', context))
                )});
            }
        });
    }
}

FearsomeMystic.id = 'fearsome-mystic';

module.exports = FearsomeMystic;
