const Card = require('../../Card.js');

class Tribute extends Card {
    setupCardAbilities(ability) {
        let askForExalt = context => ({
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
        });

        let amberAmount = 2;
        this.play({
            effect: 'capture ' + amberAmount + ' amber from {1}, placing it on {0}',
            effectArgs: context => [context.player.opponent],
            target: {
                mode: 'mostStat',
                cardType: 'creature',
                controller: 'self',
                numCards: 1,
                cardStat: card => card.power
            },
            then: context => ({
                alwaysTriggers: true,
                gameAction: ability.actions.capture({ target: context.target, amount: amberAmount }),
                then: askForExalt(context)
            })
        });
    }
}

Tribute.id = 'tribute';

module.exports = Tribute;
