import Card from '../../Card.js';

class BenevolentCharity extends Card {
    // Enhance 3.
    // Play: Move each A on each friendly creature to the common supply.
    // Fate: Each enemy creature with A on it captures 1.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.removeAmber((context) => ({
                target: context.player.creaturesInPlay,
                all: true
            }))
        });

        this.fate({
            gameAction: ability.actions.capture((context) => ({
                target: context.game.activePlayer.opponent.creaturesInPlay.filter(
                    (card) => card.amber > 0
                ),
                amount: 1
            }))
        });
    }
}

BenevolentCharity.id = 'benevolent-charity';

export default BenevolentCharity;
