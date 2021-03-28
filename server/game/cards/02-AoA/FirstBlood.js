const Card = require('../../Card.js');

class FirstBlood extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.allocateDamage((context) => ({
                numSteps:
                    context.player.cardsInPlay.filter(
                        (card) => card.type === 'creature' && card.hasHouse('brobnar')
                    ).length * 2
            })),
            effect: 'deal 2 damage for each friendly brobnar creature, totalling {1}',
            effectArgs: (context) =>
                context.player.cardsInPlay.filter(
                    (card) => card.type === 'creature' && card.hasHouse('brobnar')
                ).length * 2
        });
    }
}

FirstBlood.id = 'first-blood';

module.exports = FirstBlood;
