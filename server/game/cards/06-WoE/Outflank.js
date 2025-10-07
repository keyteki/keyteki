import Card from '../../Card.js';

class Outflank extends Card {
    // Play: Each Sanctum flank creature captures 2 from its opponent.
    setupCardAbilities(ability) {
        this.play({
            effect: 'cause each Sanctum flank creature to capture 2 amber from their opponent',
            gameAction: [
                ability.actions.capture((context) => ({
                    amount: 2,
                    target: context.player.creaturesInPlay.filter(
                        (card) => card.hasHouse('sanctum') && card.isOnFlank()
                    )
                })),
                ability.actions.capture((context) => ({
                    amount: 2,
                    player: context.player,
                    target: context.player.opponent
                        ? context.player.opponent.creaturesInPlay.filter(
                              (card) => card.hasHouse('sanctum') && card.isOnFlank()
                          )
                        : []
                }))
            ]
        });
    }
}

Outflank.id = 'outflank';

export default Outflank;
