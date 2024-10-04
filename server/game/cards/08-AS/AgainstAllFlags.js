const Card = require('../../Card.js');

class AgainstAllFlags extends Card {
    // Play: Steal 2A if any flank creature shares a house with
    // another flank creature. Otherwise, steal 1A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal((context) => ({
                amount: context.game.creaturesInPlay
                    .filter((c1) => c1.isOnFlank())
                    .some((c1) =>
                        c1
                            .getHouses()
                            .some((h) =>
                                context.game.creaturesInPlay.some(
                                    (c2) => c1 !== c2 && c2.isOnFlank() && c2.hasHouse(h)
                                )
                            )
                    )
                    ? 2
                    : 1
            }))
        });
    }
}

AgainstAllFlags.id = 'against-all-flags';

module.exports = AgainstAllFlags;
