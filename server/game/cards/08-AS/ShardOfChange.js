import Card from '../../Card.js';

function numShards(context) {
    return (
        1 +
        context.player.cardsInPlay.filter(
            (card) => card !== context.source && card.hasTrait('shard')
        ).length
    );
}

class ShardOfChange extends Card {
    // Action: For each friendly Shard, you may swap a card from your
    // hand with a card of the same type in your discard pile.
    setupCardAbilities(ability) {
        this.action({
            targets: {
                first: {
                    controller: 'self',
                    location: 'hand',
                    optional: true,
                    cardCondition: (card, context) =>
                        context.player.discard.some((c) => c.type === card.type)
                },
                second: {
                    dependsOn: 'first',
                    controller: 'self',
                    location: 'discard',
                    cardCondition: (card, context) =>
                        context.targets.first && card.type === context.targets.first.type
                }
            },
            gameAction: ability.actions.swapDiscardWithHand((context) => ({
                target: context.targets.first,
                discardCard: context.targets.second
            })),
            then: (preThenContext) => ({
                condition: (context) =>
                    preThenContext.secondResolution
                        ? numShards(context) > preThenContext.secondResolution + 1
                        : numShards(context) > 1,
                gameAction: ability.actions.resolveAbility({
                    ability: preThenContext.ability,
                    secondResolution: preThenContext.secondResolution
                        ? preThenContext.secondResolution + 1
                        : 1
                })
            })
        });
    }
}

ShardOfChange.id = 'shard-of-change';

export default ShardOfChange;
