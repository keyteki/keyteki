import Card from '../../Card.js';

class GhostlyDrVerokter extends Card {
    // Play/After Reap: Return a card from your discard pile to the
    // top of your deck.
    //
    // Destroyed: If you are haunted, archive Ghostly Dr. Verokter.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            target: {
                controller: 'self',
                location: 'discard',
                gameAction: ability.actions.returnToDeck()
            }
        });

        this.destroyed({
            condition: (context) => context.source.controller.isHaunted(),
            gameAction: ability.actions.archive()
        });
    }
}

GhostlyDrVerokter.id = 'ghostly-dr-verokter';

export default GhostlyDrVerokter;
