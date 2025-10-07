import Card from '../../Card.js';

class Snare extends Card {
    // Destroyed: If it is your turn, your opponent loses 1A.
    setupCardAbilities(ability) {
        this.destroyed({
            condition: (context) => context.source.controller === context.game.activePlayer,
            gameAction: ability.actions.loseAmber()
        });
    }
}

Snare.id = 'snare';

export default Snare;
