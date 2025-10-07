import Card from '../../Card.js';

class HanPeregrine extends Card {
    // After Fight/After Reap: You may exalt Han Peregrine. If you do,
    // fully heal a damaged creature and move it to either flank of
    // its controller's battleline.
    setupCardAbilities(ability) {
        this.reap({
            fight: true,
            optional: true,
            gameAction: ability.actions.exalt(),
            then: {
                target: {
                    cardType: 'creature',
                    cardCondition: (c) => c.hasToken('damage') && c.tokens.damage > 0
                },
                gameAction: [
                    ability.actions.heal((context) => ({
                        target: context.target,
                        fully: true
                    })),
                    ability.actions.moveToFlank((context) => ({
                        target: context.target
                    }))
                ],
                message: '{0} uses {1} to heal {3} fully and move it to a flank',
                messageArgs: (context) => [context.target]
            }
        });
    }
}

HanPeregrine.id = 'han-peregrine';

export default HanPeregrine;
