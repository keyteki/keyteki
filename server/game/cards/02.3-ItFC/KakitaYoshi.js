const DrawCard = require('../../drawcard.js');

class KakitaYoshi extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw 3 cards',
            condition: () => this.isParticipating(),
            cost: ability.costs.discardImperialFavor(),
            handler: () => {
                this.game.addMessage('{0} uses {1}, discarding the favor to draw 3 cards, and reduce the cost of events this conflict', this.controller, this);
                this.controller.drawCardsToHand(3);
                this.untilEndOfConflict(ability => ({
                    targetType: 'player',
                    effect: ability.effects.reduceCost({
                        amount: 2,
                        match: card => card.type === 'event'
                    })
                }));
            }
        });
    }
}

KakitaYoshi.id = 'kakita-yoshi'; // This is a guess at what the id might be - please check it!!!

module.exports = KakitaYoshi;
