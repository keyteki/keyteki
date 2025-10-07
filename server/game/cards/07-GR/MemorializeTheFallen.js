import Card from '../../Card.js';

class MemorializeTheFallen extends Card {
    // Play: Each player loses A equal to the number of creatures in
    // their discard pile.
    setupCardAbilities(ability) {
        this.play({
            effect: 'make {1} lose {2} amber and {3} lose {4} amber',
            effectArgs: (context) => [
                context.player,
                context.player.discard.filter((c) => c.type === 'creature').length,
                context.player.opponent,
                context.player.opponent
                    ? context.player.opponent.discard.filter((c) => c.type === 'creature').length
                    : 0
            ],
            gameAction: [
                ability.actions.loseAmber((context) => ({
                    target: context.player,
                    amount: context.player.discard.filter((c) => c.type === 'creature').length
                })),
                ability.actions.loseAmber((context) => ({
                    amount: context.player.opponent
                        ? context.player.opponent.discard.filter((c) => c.type === 'creature')
                              .length
                        : 0
                }))
            ]
        });
    }
}

MemorializeTheFallen.id = 'memorialize-the-fallen';

export default MemorializeTheFallen;
