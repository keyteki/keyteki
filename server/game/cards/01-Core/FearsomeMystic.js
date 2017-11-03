const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

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
            handler: () => {
                this.game.addMessage('{0} uses {1} to remove 1 fate from all opposing characters with lower glory than her', this.controller, this);
                _.each(this.game.findAnyCardsInPlay(card => {
                    return this.game.currentConflict.isParticipating(card) && card.controller !== this.controller && card.getGlory() < this.getGlory() && card.fate > 0;
                }), card => card.modifyFate(-1));
            }
        });
    }
}

FearsomeMystic.id = 'fearsome-mystic';

module.exports = FearsomeMystic;
