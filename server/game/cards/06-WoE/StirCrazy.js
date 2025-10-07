import Card from '../../Card.js';

class StirCrazy extends Card {
    //Play: Each ready creature captures 1A from its opponent.
    setupCardAbilities(ability) {
        this.play({
            effect: 'cause each ready creature to capture 1 amber from their opponent',
            gameAction: [
                ability.actions.capture((context) => ({
                    target: context.player.creaturesInPlay.filter((card) => !card.exhausted)
                })),
                ability.actions.capture((context) => ({
                    player: context.player,
                    target: context.player.opponent
                        ? context.player.opponent.creaturesInPlay.filter((card) => !card.exhausted)
                        : []
                }))
            ]
        });
    }
}

StirCrazy.id = 'stir-crazy';

export default StirCrazy;
