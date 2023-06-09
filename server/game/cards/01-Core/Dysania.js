const Card = require('../../Card.js');

class Dysania extends Card {
    // Play: Your opponent discards each of their archived cards. You gain 1A for each card discarded this way.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: "discard all cards in {1}'s archives, and gain {2} amber",
            effectArgs: (context) => [
                context.player.opponent,
                context.player.opponent.archives.filter((card) => card.owner === card.controller)
                    .length
            ],
            gameAction: [
                ability.actions.discard((context) => ({
                    target: context.player.opponent.archives
                })),
                ability.actions.gainAmber((context) => ({
                    amount: context.player.opponent.archives.filter(
                        (card) => card.owner === card.controller
                    ).length
                }))
            ]
        });
    }
}

Dysania.id = 'dysania';

module.exports = Dysania;
