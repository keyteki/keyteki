const Card = require('../../Card.js');

class PainReaction extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: {
                condition: context => context.preThenEvent.destroyed,
                gameAction: ability.actions.dealDamage(context => ({
                    amount: 2,
                    target: context.preThenEvent.card.neighbors
                }))
            }
        });
    }
}

PainReaction.id = 'pain-reaction';

module.exports = PainReaction;
