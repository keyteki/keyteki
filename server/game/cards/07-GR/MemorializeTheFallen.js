const Card = require('../../Card.js');

class MemorializeTheFallen extends Card {
    // Play: Each player loses A equal to the number of creatures in
    // their discard pile.
    setupCardAbilities(ability) {
        this.play({
            effect:
                'each player loses amber equal to the number of creatures in their discard pile',
            gameAction: [
                ability.actions.loseAmber((context) => ({
                    amount: context.player.opponent
                        ? context.player.opponent.discard.filter((c) => c.type === 'creature')
                              .length
                        : 0
                })),
                ability.actions.loseAmber((context) => ({
                    target: context.player,
                    amount: context.player.discard.filter((c) => c.type === 'creature').length
                }))
            ]
        });
    }
}

MemorializeTheFallen.id = 'memorialize-the-fallen';

module.exports = MemorializeTheFallen;
