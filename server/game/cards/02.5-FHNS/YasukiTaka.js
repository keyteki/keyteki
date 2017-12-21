const DrawCard = require('../../drawcard.js');

class YasukiTaka extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain fate',
            when: {
                onCardLeavesPlay: event => this.game.currentPhase === 'conflict' && event.cardStateWhenLeftPlay.factions['crab'] > 0 && 
                                           event.cardStateWhenLeftPlay.type === 'character'
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
