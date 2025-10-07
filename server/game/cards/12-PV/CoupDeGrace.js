import Card from '../../Card.js';

class CoupDeGrace extends Card {
    // Play: Destroy each damaged creature.
    // Fate: Deal 4 to each friendly creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.hasToken('damage'))
            }))
        });

        this.fate({
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.game.activePlayer.creaturesInPlay,
                amount: 4
            }))
        });
    }
}

CoupDeGrace.id = 'coup-de-grâce';

export default CoupDeGrace;
