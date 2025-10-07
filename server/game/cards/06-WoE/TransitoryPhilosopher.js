import Card from '../../Card.js';

class TransitoryPhilosopher extends Card {
    //Action: Steal 1A for each enemy artifact.
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.steal((context) => ({
                amount:
                    1 *
                    context.game.cardsInPlay.filter(
                        (card) => card.controller !== context.player && card.type === 'artifact'
                    ).length
            }))
        });
    }
}

TransitoryPhilosopher.id = 'transitory-philosopher';

export default TransitoryPhilosopher;
