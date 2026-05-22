const Card = require('../../Card.js');

class ColdRopes extends Card {
    // Play: If you are overwhelmed, put an enemy creature on the bottom of its owner's deck. Otherwise, move an enemy creature to a flank of its controller's battleline and exhaust it.
    setupCardAbilities(ability) {
        this.play({
            preferActionPromptMessage: true,
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.conditional((context) => ({
                    condition: context.player.isOverwhelmed(),
                    trueGameAction: ability.actions.returnToDeck({
                        bottom: true,
                        target: context.target
                    }),
                    falseGameAction: ability.actions.moveToFlank({ target: context.target })
                }))
            },
            then: (preThenContext) =>
                preThenContext.player.isOverwhelmed()
                    ? {
                          alwaysTriggers: true,
                          condition: () => !!preThenContext.target,
                          message: "{0} uses {1} to put {3} on the bottom of {4}'s deck",
                          messageArgs: () =>
                              preThenContext.target
                                  ? [preThenContext.target, preThenContext.target.owner]
                                  : []
                      }
                    : {
                          alwaysTriggers: true,
                          condition: () => !!preThenContext.target,
                          gameAction: ability.actions.exhaust({
                              target: preThenContext.target
                          }),
                          message: '{0} uses {1} to move {3} to the {4} flank and exhaust it',
                          messageArgs: () => {
                              const t = preThenContext.target;
                              if (!t) return [];
                              const inPlay = t.controller.cardsInPlay;
                              const side =
                                  inPlay.length <= 1 || inPlay.indexOf(t) === 0 ? 'left' : 'right';
                              return [t, side];
                          }
                      }
        });
    }
}

ColdRopes.id = 'cold-ropes';

module.exports = ColdRopes;
