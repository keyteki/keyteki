import Card from '../../Card.js';
class Infiltrator extends Card {
    // Skirmish. Treachery. Versatile.
    //
    // At the end of your turn, destroy Infiltrator’s neighbors.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onTurnEnd: (event, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.destroy((context) => ({
                target: context.source.neighbors
            }))
        });
    }
}

Infiltrator.id = 'infiltrator';

export default Infiltrator;
