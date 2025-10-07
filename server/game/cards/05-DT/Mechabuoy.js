import Card from '../../Card.js';

class Mechabuoy extends Card {
    // (T) At the start of each player’s turn, if the tide is high for that player, they gain 1A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onBeginRound: () => this.game.activePlayer.isTideHigh()
            },
            gameAction: ability.actions.gainAmber(() => ({
                target: this.game.activePlayer
            }))
        });
    }
}

Mechabuoy.id = 'mechabuoy';

export default Mechabuoy;
