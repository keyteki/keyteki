const DrawCard = require('../../../drawcard.js');

class BearIsland extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, card) => card.getType() !== 'plot' && card.controller === this.controller && card.isLoyal() && this.game.currentPhase === 'marshal'
            },
            limit: ability.limit.perPhase(2),
            handler: () => {
                this.game.addGold(this.controller, 1);
                this.game.addMessage('{0} uses {1} to gain 1 gold', this.controller, this);
            }
        });
    }
}

BearIsland.code = '04042';

module.exports = BearIsland;
