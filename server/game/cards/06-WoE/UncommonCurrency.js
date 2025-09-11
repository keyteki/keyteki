const Card = require('../../Card.js');

class UncommonCurrency extends Card {
    // Action: Swap control of Uncommon Currency and an enemy artifact.
    setupCardAbilities(ability) {
        this.action({
            condition: (context) =>
                !!context.player.opponent &&
                context.player.opponent.cardsInPlay.some((c) => c.type === 'artifact'),
            target: {
                cardType: 'artifact',
                controller: 'opponent',
                gameAction: [
                    ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        effect: ability.effects.takeControl(context.player)
                    })),
                    ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        target: context.source,
                        effect: ability.effects.takeControl(context.player.opponent)
                    }))
                ]
            },
            effect: 'swap control of {0} and {1}',
            effectArgs: (context) => [context.source]
        });
    }
}

UncommonCurrency.id = 'uncommon-currency';

module.exports = UncommonCurrency;
