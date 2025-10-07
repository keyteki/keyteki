import Card from '../../Card.js';

class Memette extends Card {
    // Play/Destroyed: Archive the top card of your discard pile.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.discard.length > 0,
            gameAction: ability.actions.archive((context) => ({
                target: context.player.discard[0]
            }))
        });

        this.destroyed({
            condition: (context) => context.player.discard.length > 0,
            gameAction: ability.actions.archive((context) => ({
                target: context.player.discard[0]
            }))
        });
    }
}

Memette.id = 'memette';

export default Memette;
