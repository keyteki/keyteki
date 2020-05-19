const Card = require('../../Card.js');

class MartiansMakeBadAllies extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'reveal their hand: {1} and purge {2}',
            effectArgs: (context) => [
                context.player.hand,
                context.player.hand.filter(
                    (card) => card.type === 'creature' && !card.hasHouse('mars')
                )
            ],
            gameAction: [
                ability.actions.purge((context) => ({
                    target: context.player.hand.filter(
                        (card) => card.type === 'creature' && !card.hasHouse('mars')
                    )
                })),
                ability.actions.gainAmber((context) => ({
                    amount: context.player.hand.filter(
                        (card) => card.type === 'creature' && !card.hasHouse('mars')
                    ).length
                }))
            ]
        });
    }
}

MartiansMakeBadAllies.id = 'martians-make-bad-allies';

module.exports = MartiansMakeBadAllies;
