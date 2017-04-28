const DrawCard = require('../../../drawcard.js');

class BearIsland extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card.getType() !== 'plot' && event.card.controller === this.controller && event.card.isLoyal() && event.playingType === 'marshal'
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
