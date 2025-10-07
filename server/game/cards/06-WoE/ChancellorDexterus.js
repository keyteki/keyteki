import Card from '../../Card.js';

class ChancellorDexterus extends Card {
    // After Reap: You may exalt Chancellor Dexterus's right
    // neighbor. If you do, that creature belongs to house Saurian for
    // the remainder of the turn (instead of its other houses).
    setupCardAbilities(ability) {
        this.reap({
            target: {
                controller: 'self',
                cardType: 'creature',
                cardCondition: (card, context) => card === context.source.rightNeighbor(),
                optional: true
            },
            gameAction: [
                ability.actions.exalt((context) => ({
                    target: context.target
                })),
                ability.actions.cardLastingEffect((context) => ({
                    effect: ability.effects.changeHouse('saurian'),
                    target: context.target
                }))
            ],
            effect:
                'exalt its right neighbor and make it house Saurian for the remainder of the turn'
        });
    }
}

ChancellorDexterus.id = 'chancellor-dexterus';

export default ChancellorDexterus;
