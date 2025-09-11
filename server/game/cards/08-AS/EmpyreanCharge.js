const Card = require('../../Card.js');

class EmpyreanCharge extends Card {
    // Play: Forge a key at +6A current cost, reduced by the total
    // combined number of cards in both player’s archives. Discard
    // each player’s archives.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forgeKey((context) => ({
                modifier:
                    6 -
                    context.player.archives.length -
                    (context.player.opponent ? context.player.opponent.archives.length : 0)
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.discard((context) => ({
                    target: context.player.archives.concat(
                        context.player.opponent ? context.player.opponent.archives : []
                    )
                })),
                messageArgs: (context) => [
                    context.player.archives.concat(
                        context.player.opponent ? context.player.opponent.archives : []
                    )
                ]
            }
        });
    }
}

EmpyreanCharge.id = 'empyrean-charge';

module.exports = EmpyreanCharge;
