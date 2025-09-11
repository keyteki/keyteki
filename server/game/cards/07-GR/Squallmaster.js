const Card = require('../../Card.js');

class Squallmaster extends Card {
    // After Fight/After Reap: Each player discards a random card from their hand.
    //
    // Scrap: Exhaust an enemy creature.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            gameAction: ability.actions.discardAtRandom((context) => ({
                target: context.player
            })),
            then: {
                alwaysTriggers: true,
                condition: (context) => !!context.player.opponent,
                gameAction: ability.actions.discardAtRandom((context) => ({
                    target: context.player.opponent
                }))
            }
        });

        this.scrap({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.exhaust()
            }
        });
    }
}

Squallmaster.id = 'squallmaster';

module.exports = Squallmaster;
