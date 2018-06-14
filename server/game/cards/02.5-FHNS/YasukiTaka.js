const DrawCard = require('../../drawcard.js');

class YasukiTaka extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain fate',
            when: {
                onCardLeavesPlay: event => this.game.currentPhase === 'conflict' && event.cardStateWhenLeftPlay.isFaction('crab') > 0 && 
                                           event.cardStateWhenLeftPlay.type === 'character'
            },
            limit: ability.limit.perPhase(Infinity),
            gameAction: ability.actions.gainFate()
        });
    }
}

YasukiTaka.id = 'yasuki-taka';

module.exports = YasukiTaka;
