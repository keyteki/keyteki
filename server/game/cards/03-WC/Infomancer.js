const Card = require('../../Card.js');

class Infomancer extends Card {
    // Elusive.
    // Play: Graft an action card from your hand onto Infomancer. (Place it faceup under this card.)
    // Reap: Trigger the play effect of an action card grafted onto Infomancer.
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: 'hand',
                controller: 'self',
                cardType: 'action',
                gameAction: ability.actions.graft((context) => ({ parent: context.source }))
            }
        });

        this.reap({
            effect: 'trigger the play effect of {0}',
            target: {
                location: 'any',
                controller: 'self',
                cardType: 'action',
                cardCondition: (card, context) =>
                    card.parent === context.source && card.location === 'grafted',
                gameAction: ability.actions.resolveAbility({
                    ability: (ability) => ability.isPlay()
                })
            }
        });
    }
}

Infomancer.id = 'infomancer';

module.exports = Infomancer;
