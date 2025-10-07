import Card from '../../Card.js';

class ShardOfCourage extends Card {
    // Action: For each friendly Shard, ready and fight with a
    // friendly creature. Resolve these fights one at a time.
    setupCardAbilities(ability) {
        this.currentTarget = null;

        this.action({
            gameAction: ability.actions.sequentialForEach((context) => ({
                num:
                    1 +
                    context.player.cardsInPlay.filter(
                        (card) => card !== context.source && card.hasTrait('shard')
                    ).length,
                action: ability.actions.sequential([
                    ability.actions.ready({
                        promptForSelect: {
                            cardType: 'creature',
                            controller: 'self'
                        }
                    }),
                    ability.actions.fight(() => {
                        if (
                            context.ability.gameAction.length == 0 ||
                            !context.ability.gameAction[0].action ||
                            !context.ability.gameAction[0].action.gameActions[0].target
                        ) {
                            return;
                        }

                        // Get the most recent target from the previous action.
                        let prevAction = context.ability.gameAction[0].action.gameActions[0];
                        return { target: prevAction.target[prevAction.target.length - 1] };
                    })
                ])
            })),
            effect: 'ready and fight with a creature for each friendly shard'
        });
    }
}

ShardOfCourage.id = 'shard-of-courage';

export default ShardOfCourage;
