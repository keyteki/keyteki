const Card = require('../../Card.js');

class RelentlessAssault extends Card {
    // Play: Ready and fight with up
    // to 3 different friendly creatures,
    // one at a time.
    setupCardAbilities(ability) {
        const targetProps = (excluded) => ({
            cardType: 'creature',
            controller: 'self',
            mode: 'single',
            optional: true,
            cardCondition: (card) => !excluded.includes(card),
            gameAction: ability.actions.sequential([
                ability.actions.ready(),
                ability.actions.fight()
            ])
        });

        const thenMessage = {
            message: '{0} uses {1} to ready and fight with {2}',
            messageArgs: (context) => [context.player, context.source, context.target]
        };

        this.play({
            target: targetProps([]),
            effect: 'ready and fight with {0}',
            then: (context1) =>
                context1.target
                    ? {
                          target: targetProps([context1.target]),
                          ...thenMessage,
                          then: (context2) =>
                              context2.target
                                  ? {
                                        target: targetProps([context1.target, context2.target]),
                                        ...thenMessage
                                    }
                                  : { alwaysTriggers: true }
                      }
                    : { alwaysTriggers: true }
        });
    }
}

RelentlessAssault.id = 'relentless-assault';

module.exports = RelentlessAssault;
