const DrawCard = require('../../drawcard.js');

class DaimyosFavor extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow to reduce attachment cost',
            cost: ability.costs.bowSelf(),
            handler: () => {
                this.game.addMessage('{0} bows {1} to reduce the cost of the next attachment they play on {2} by 1', this.controller, this, this.parent);
                this.untilEndOfPhase(ability => ({
                    //TODO: need to make this only work on cards which are played on the same character
                    targetType: 'player',
                    effect: ability.effects.reduceNextPlayedCardCost(1, card => card.type === 'attachment')
                }));
            }
        });
    }
}

DaimyosFavor.id = 'daimyo-s-favor';

module.exports = DaimyosFavor;
