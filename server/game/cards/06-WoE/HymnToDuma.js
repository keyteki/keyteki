const Card = require('../../Card.js');

class HymnToDuma extends Card {
    //Each friendly creature gains, "Omni: Destroy this creature. A friendly creature captures 2A."
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature',
            effect: ability.effects.gainAbility('omni', {
                gameAction: ability.actions.destroy((context) => ({
                    target: context.source
                })),
                then: {
                    alwaysTriggers: true,
                    target: {
                        cardType: 'creature',
                        controller: 'self',
                        gameAction: ability.actions.capture({ amount: 2 })
                    },
                    message: '{0} uses {3} to capture {4} amber, placing it on {2}',
                    messageArgs: (context) => [
                        this,
                        context.player.opponent.amber >= 2 ? 2 : context.player.opponent.amber
                    ]
                }
            })
        });
    }
}

HymnToDuma.id = 'hymn-to-duma';

module.exports = HymnToDuma;
