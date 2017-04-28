const DrawCard = require('../../../drawcard.js');

class BrandonsGift extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: event => (
                    event.card.controller === this.controller &&
                    event.playingType === 'marshal' &&
                    event.card.hasTrait('Builder') &&
                    event.card.getType() === 'character')

            },
            limit: ability.limit.perPhase(3),
            handler: () => {
                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    targetController: 'current',
                    effect: ability.effects.reduceNextMarshalledCardCost(1, card => card.isFaction('thenightswatch'))
                }));
                
                this.game.addMessage('{0} uses {1} to reduce the cost of the next The Night\'s Watch card they marshal by 1', 
                                      this.controller, this);
            }
        });
    }
}

BrandonsGift.code = '02026';

module.exports = BrandonsGift;
