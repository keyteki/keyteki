const Card = require('../../Card.js');

class Tribute extends Card {
    // Play: The most powerful friendly creature captures 2A. You may exalt that creature to repeat the preceding effect.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'mostStat',
                cardType: 'creature',
                controller: 'self',
                numCards: 1,
                cardStat: (card) => card.power
            },
            gameAction: ability.actions.capture((context) => ({
                target: context.target,
                amount: 2
            })),
            then: (context) => ({
                alwaysTriggers: true,
                condition: () => !context.secondResolution,
                may: 'exalt the creature',
                gameAction: ability.actions.exalt({ target: context.target }),
                then: {
                    gameAction: ability.actions.resolveAbility({
                        ability: context.ability,
                        secondResolution: true
                    }),
                    message: '{0} exalts {3} to repeat the effect of {1}',
                    messageArgs: context.target
                }
            })
        });
    }
}

Tribute.id = 'tribute';

module.exports = Tribute;
