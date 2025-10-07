import Card from '../../Card.js';

class Antanagoge extends Card {
    // Play: You may graft an enemy creature onto Antanagoge.
    // After Reap: Deal damage to each creature equal to the power of a creature grafted onto Antanagoge.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.graft((context) => ({
                    parent: context.source
                }))
            }
        });

        this.reap({
            effect: 'deal damage to each creature equal to the power of {0}',
            condition: (context) =>
                context.source.childCards.filter((card) => card.location === 'grafted').length > 0,
            target: {
                location: 'any',
                cardCondition: (card, context) =>
                    card.type === 'creature' && card.parent === context.source,
                gameAction: ability.actions.dealDamage((context) => ({
                    amount: context.target.power,
                    target: context.game.creaturesInPlay
                }))
            }
        });
    }
}

Antanagoge.id = 'antanagoge';

export default Antanagoge;
