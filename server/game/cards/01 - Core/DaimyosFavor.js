const DrawCard = require('../../drawcard.js');

class DaimyosFavor extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow to reduce attachment cost',
            cost: ability.costs.bowSelf(),
            handler: () => {
                this.game.addMessage('{0} bows {1} to reduce the cost of the next attachment they play on {2} by 1', this.controller, this, this.parent);
                this.untilEndOfPhase(ability => ({
                    targetType: 'player',
                    effect: ability.effects.reduceCost({
                        playingTypes: 'play',
                        amount: 1,
                        match: card => card.type === 'attachment',
                        targetCondition: target => target === this.parent,
                        limit: ability.limit.fixed(1)
                    })
                }));
            }
        });
    }
    
    canAttach(card) {
        if(card.controller !== this.controller) {
            return false;
        }
        return super.canAttach(card);
    }
}

DaimyosFavor.id = 'daimyo-s-favor';

module.exports = DaimyosFavor;
