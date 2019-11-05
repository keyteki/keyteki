const Card = require('../../Card.js');

class Tribute extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'mostStat',
                cardType: 'creature',
                controller: 'self',
                numCards: 1,
                cardStat: card => card.power,
                gameAction: ability.actions.capture({ amount: 2 })
            },
            then: preThenContext => ({
                condition: context => !preThenContext.secondResolution,
                may: 'exhalt the creature',
                gameAction: ability.actions.exalt({ target: preThenContext.target }),
                then: {
                    gameAction: ability.actions.resolveAbility({
                        ability: preThenContext.ability,
                        secondResolution: true
                    }),
                    message: '{0} exalts {3} to repeat the effect of {1}',
                    messageArgs: preThenContext.target
                }
            })
        });
    }
}

Tribute.id = 'tribute';

module.exports = Tribute;
