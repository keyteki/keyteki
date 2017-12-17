const DrawCard = require('../../drawcard.js');

class YasukiTaka extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain fate',
            when: {
                onCardLeavesPlay: event => event.card.controller === this.controller && event.card.factions['crab'] > 0 && 
                                           event.card.type === 'character' && this.game.currentPhase === 'conflict'
            },
            limit: ability.limit.perPhase(Infinity),
            handler: () => {
                this.game.addMessage('{0} uses {1} to gain 1 fate', this.controller, this);
                this.game.addFate(this.controller, 1);
            }
        });
    }
}

YasukiTaka.id = 'yasuki-taka';

module.exports = YasukiTaka;
