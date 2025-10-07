import Card from '../../Card.js';

class GeneticBlast extends Card {
    // Play: Deal 2Damage to a creature and each other creature with
    // the same name as that creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature'
            },
            effect: 'deal 2 damage to {1} and each other creature with the same name',
            effectArgs: (context) => [context.target],
            then: (preThenContext) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.dealDamage((context) => ({
                    target: context.game.cardsInPlay.filter(
                        (card) =>
                            card.name === preThenContext.target.name && card.type === 'creature'
                    ),
                    amount: 2
                }))
            })
        });
    }
}

GeneticBlast.id = 'genetic-blast';

export default GeneticBlast;
