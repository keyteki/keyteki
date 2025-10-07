import Card from '../../Card.js';

class Symposium extends Card {
    // Play: Exalt, ready, and use a friendly creature. If it is a
    // token creature, you may exalt, ready and use another friendly
    // creature.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.game.creaturesInPlay.length > 0,
            target: {
                controller: 'self',
                cardType: 'creature',
                gameAction: ability.actions.sequential([
                    ability.actions.exalt((context) => {
                        context.event.targetClone = context.target.getBottomCard().createSnapshot();
                        return {
                            context: context.target
                        };
                    }),
                    ability.actions.ready(),
                    ability.actions.use()
                ])
            },
            effect: 'exalt, ready, and use {0}',
            then: (preThenContext) => ({
                condition: () => preThenContext.event?.targetClone?.isToken(),
                target: {
                    optional: true,
                    controller: 'self',
                    cardType: 'creature',
                    cardCondition: (card) => card !== preThenContext.target,
                    gameAction: ability.actions.sequential([
                        ability.actions.exalt(),
                        ability.actions.ready(),
                        ability.actions.use()
                    ])
                },
                message: '{0} uses {1} to exalt, ready, and use {2}'
            })
        });
    }
}

Symposium.id = 'symposium';

export default Symposium;
