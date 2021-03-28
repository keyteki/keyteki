const Card = require('../../Card.js');

class Arise extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            effect: 'return {1} to their hand',
            effectArgs: (context) => [
                context.player.discard.filter(
                    (card) => card.type === 'creature' && card.hasHouse(context.house)
                )
            ],
            gameAction: [
                ability.actions.returnToHand((context) => ({
                    location: 'discard',
                    target: context.player.discard.filter(
                        (card) => card.type === 'creature' && card.hasHouse(context.house)
                    )
                })),
                ability.actions.gainChains()
            ]
        });
    }
}

Arise.id = 'arise';

module.exports = Arise;
