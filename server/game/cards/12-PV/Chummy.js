import Card from '../../Card.js';

class Chummy extends Card {
    // Before Fight: If the creature Chummy fights is the least powerful enemy creature, steal 1.
    // Fate: Pay your opponent 2.
    setupCardAbilities(ability) {
        this.beforeFight({
            gameAction: ability.actions.steal((context) => ({
                amount:
                    context.player.opponent &&
                    context.event.card.power ===
                        Math.min(
                            ...context.player.opponent.creaturesInPlay.map((card) => card.power)
                        )
                        ? 1
                        : 0
            }))
        });

        this.fate({
            gameAction: ability.actions.transferAmber((context) => ({
                amount: 2,
                target: context.game.activePlayer
            }))
        });
    }
}

Chummy.id = 'chummy';

export default Chummy;
