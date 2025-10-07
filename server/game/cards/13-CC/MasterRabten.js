import Card from '../../Card.js';

class MasterRabten extends Card {
    // Play/After Reap: Each friendly Monk creature captures 1A.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            gameAction: ability.actions.capture((context) => ({
                target: context.game.cardsInPlay.filter(
                    (card) => card.controller === context.player && card.hasTrait('monk')
                ),
                amount: 1
            }))
        });
    }
}

MasterRabten.id = 'master-rabten';

export default MasterRabten;
