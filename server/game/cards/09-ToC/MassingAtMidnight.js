import Card from '../../Card.js';

class MassingAtMidnight extends Card {
    // Play: Make 3 token creatures. Purge Massing at Midnight.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature({
                amount: 3
            }),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.purge((context) => ({
                    target: context.source
                }))
            }
        });
    }
}

MassingAtMidnight.id = 'massing-at-midnight';

export default MassingAtMidnight;
