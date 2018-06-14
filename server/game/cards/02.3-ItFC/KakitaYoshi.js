const DrawCard = require('../../drawcard.js');

class KakitaYoshi extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw 3 cards',
            condition: context => context.source.isParticipating(),
            cost: ability.costs.discardImperialFavor(),
            effect: 'draw 3 cards, and reduce the cost of events this conflict',
            gameAction: [
                ability.actions.draw(3), 
                ability.actions.playerLastingEffect({
                    effect: ability.effects.reduceCost({
                        amount: 2,
                        match: card => card.type === 'event'
                    })
                })
            ]
        });
    }
}

KakitaYoshi.id = 'kakita-yoshi'; // This is a guess at what the id might be - please check it!!!

module.exports = KakitaYoshi;
