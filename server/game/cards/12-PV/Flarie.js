import Card from '../../Card.js';

class Flarie extends Card {
    // At the start of your turn, gain 1 amber.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBeginRound: (_, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.gainAmber()
        });
    }
}

Flarie.id = 'flarie';

export default Flarie;
