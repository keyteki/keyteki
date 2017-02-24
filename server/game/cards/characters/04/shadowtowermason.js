const DrawCard = require('../../../drawcard.js');

class ShadowTowerMason extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.getCardCount() >= 3,
            match: this,
            effect: [
                ability.effects.addIcon('military'),
                ability.effects.addIcon('intrigue')
            ]
        });
    }

    getCardCount() {
        var count = this.controller.allCards.reduce((counter, card) => {
            if(this.isBlank() || card.location !== 'play area' || !card.isFaction('thenightswatch') || (card.getType() !== 'location' && card.getType() !== 'attachment')) {
                return counter;
            }

            return counter + 1;
        }, 0);

        return count;
    }
}

ShadowTowerMason.code = '04065';

module.exports = ShadowTowerMason;
