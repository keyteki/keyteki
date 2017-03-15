const DrawCard = require('../../../drawcard.js');

class TowerOfTheSun extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardPlayed: (event, player, card) => card.getType() === 'event'
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                this.game.addGold(this.controller, 1);
                this.game.addMessage('{0} uses {1} to gain 1 gold', this.controller, this);
            }
        });
    }
}

TowerOfTheSun.code = '04017';

module.exports = TowerOfTheSun;
