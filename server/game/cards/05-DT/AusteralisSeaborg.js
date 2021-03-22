const Card = require('../../Card.js');

class AusteralisSeaborg extends Card {
    //Reap: Deal 2 to a creature. If this damage destroys that creature, raise the tide.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 2 })
            },
            then: {
                condition: (context) =>
                    context.preThenEvent.card && context.preThenEvent.card.location !== 'play area',
                gameAction: ability.actions.raiseTide()
            }
        });
    }
}

AusteralisSeaborg.id = 'austeralis-seaborg';

module.exports = AusteralisSeaborg;
