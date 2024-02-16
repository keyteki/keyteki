const Card = require('../../Card.js');

class MissileOfficerMyers extends Card {
    // Play/After Reap: Resolve the play effect of a neighboring
    // creature as if you had just played it.
    //
    // Scrap: Discard a card from your hand, resolve its play effect as if
    // you had just played it.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.resolveAbility({
                    ability: (ability) => ability.isPlay()
                })
            }
        });

        this.scrap({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.discard()
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.resolveAbility({
                    target: preThenContext.target,
                    ability: (ability) => ability.isPlay()
                })
            })
        });
    }
}

MissileOfficerMyers.id = 'missile-officer-myers';

module.exports = MissileOfficerMyers;
