import Card from '../../Card.js';

class PhantasmalVisit extends Card {
    // Play: Stun and exhaust a creature. If you are haunted, archive
    // Phantasmal Visit.
    setupCardAbilities(ability) {
        this.play({
            effectStyle: 'all',
            target: {
                cardType: 'creature',
                controller: 'any',
                gameAction: [ability.actions.exhaust(), ability.actions.stun()]
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.isHaunted(),
                message: '{0} uses {1} to archive {1}',
                gameAction: ability.actions.archive((context) => ({
                    target: context.source
                }))
            }
        });
    }
}

PhantasmalVisit.id = 'phantasmal-visit';

export default PhantasmalVisit;
