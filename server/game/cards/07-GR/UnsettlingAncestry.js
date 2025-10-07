import Card from '../../Card.js';

class UnsettlingAncestry extends Card {
    // Play: Stun and exhaust an enemy creature. If you are haunted,
    // archive Unsettling Ancestry.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'opponent',
                cardType: 'creature',
                gameAction: [ability.actions.exhaust(), ability.actions.stun()]
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.isHaunted(),
                gameAction: ability.actions.archive((context) => ({
                    target: context.source
                }))
            }
        });
    }
}

UnsettlingAncestry.id = 'unsettling-ancestry';

export default UnsettlingAncestry;
