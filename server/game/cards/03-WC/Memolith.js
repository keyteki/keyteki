const Card = require('../../Card.js');

class Memolith extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                location: 'any',
                controller: 'self',
                cardType: 'action',
                cardCondition: (card, context) =>
                    card.location === 'hand' ||
                    (card.parent === context.source && card.location === 'grafted'),
                gameAction: ability.actions.conditional({
                    condition: (context) => context.target.location === 'hand',
                    trueGameAction: ability.actions.graft((context) => ({
                        parent: context.source
                    })),
                    falseGameAction: ability.actions.resolveAbility({
                        ability: (ability) => ability.isPlay()
                    })
                })
            }
        });
    }
}

Memolith.id = 'memolith';

module.exports = Memolith;
