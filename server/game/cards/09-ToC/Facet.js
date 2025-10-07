import Card from '../../Card.js';

class Facet extends Card {
    // Destroyed: If it is your turn, gain 1A.
    setupCardAbilities(ability) {
        this.destroyed({
            condition: (context) => context.source.controller === context.game.activePlayer,
            gameAction: ability.actions.gainAmber()
        });
    }
}

Facet.id = 'facet';

export default Facet;
