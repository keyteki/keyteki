import Card from '../../Card.js';

class Strug extends Card {
    // Play/Destroyed: Your opponent loses 1.
    // Fate: Lose 2.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player.opponent,
                amount: 1
            }))
        });

        this.destroyed({
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.player.opponent,
                amount: 1
            }))
        });

        this.fate({
            gameAction: ability.actions.loseAmber((context) => ({
                target: context.game.activePlayer,
                amount: 2
            }))
        });
    }
}

Strug.id = 'strug';

export default Strug;
