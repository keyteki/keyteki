import Card from '../../Card.js';

class Rustmiser extends Card {
    // Reap: Exhaust each enemy artifact.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.exhaust((context) => ({
                target: context.game.cardsInPlay.filter(
                    (card) => card.controller !== context.player && card.type === 'artifact'
                )
            }))
        });
    }
}

Rustmiser.id = 'rustmiser';

export default Rustmiser;
