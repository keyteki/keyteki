const Card = require('../../Card.js');

class MakeItSo extends Card {
    //Play: Choose a house. Reveal the top card of your deck. If it belongs to that house, draw that card and repeat this effect.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'house'
            },
            effect: 'choose {1} and reveal {2}',
            effectArgs: (context) => [context.house, context.player.deck[0]],
            gameAction: ability.actions.draw((context) => ({
                amount:
                    context.player.deck.length && context.player.deck[0].hasHouse(context.house)
                        ? 1
                        : 0
            })),
            then: (preThenContext) => ({
                alwaysTriggers: true,
                message: '{0} uses {1} to resolve its effect again',
                gameAction: ability.actions.resolveAbility({
                    ability: preThenContext.ability
                })
            })
        });
    }
}

MakeItSo.id = 'make-it-so';

module.exports = MakeItSo;
