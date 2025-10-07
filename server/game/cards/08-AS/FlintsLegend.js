import Card from '../../Card.js';

class FlintsLegend extends Card {
    // Play: Move 1A from your opponent's pool to Treasure Island.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent && context.player.opponent.amber > 0,
            effect: 'move one amber from their pool to Treasure Island',
            target: {
                cardType: 'artifact',
                controller: 'any',
                cardCondition: (card) => card.name === 'Treasure Island',
                gameAction: ability.actions.placeAmber()
            },
            then: {
                gameAction: ability.actions.loseAmber((context) => ({
                    target: context.player.opponent
                }))
            }
        });
    }
}

FlintsLegend.id = 'flint-s-legend';

export default FlintsLegend;
