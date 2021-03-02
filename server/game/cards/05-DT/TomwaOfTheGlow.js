const Card = require('../../Card.js');

class TomwaOfTheGlow extends Card {
    //Reap: Exhaust a creature. If the tide is high, draw a card for each exhausted enemy creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.exhaust()
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.player.isTideHigh() && context.player.opponent,
                gameAction: ability.actions.draw((context) => ({
                    amount: context.player.opponent.creaturesInPlay.filter((card) => card.exhausted)
                        .length
                }))
            }
        });
    }
}

TomwaOfTheGlow.id = 'tomwa-of-the-glow';

module.exports = TomwaOfTheGlow;
