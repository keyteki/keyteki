const Card = require('../../Card.js');

class CynDynasty extends Card {
    // Keys cost +2.
    // After your opponent forges a key, gain 2, draw 4 cards, and destroy Cyn Dynasty.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.modifyKeyCost(2)
        });

        this.reaction({
            when: {
                onForgeKey: (event, context) => event.player === context.player.opponent
            },
            gameAction: ability.actions.sequential([
                ability.actions.gainAmber((context) => ({ target: context.player, amount: 2 })),
                ability.actions.draw((context) => ({ target: context.player, amount: 4 })),
                ability.actions.destroy((context) => ({ target: context.source }))
            ]),
            effect: 'gain 2 amber, draw 4 cards, and destroy {1}',
            effectArgs: (context) => [context.source]
        });
    }
}

CynDynasty.id = 'cyn-dynasty';

module.exports = CynDynasty;
