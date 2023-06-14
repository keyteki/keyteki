const Card = require('../../Card.js');

class BouncingDeathquark extends Card {
    // Play: Destroy an enemy creature and a friendly creature. You may repeat this effect as many times as you like, as long as it is possible to repeat the entire effect.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                enemy: {
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.destroy()
                },
                friendly: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.destroy()
                }
            },
            effect: 'destroy {1}',
            effectArgs: (context) => [Object.values(context.targets)],
            then: (context) => ({
                condition: () =>
                    context.player.cardsInPlay.some(
                        (card) => card.type === 'creature' && card.allowGameAction('destroy')
                    ) &&
                    context.player.opponent &&
                    context.player.opponent.cardsInPlay.some(
                        (card) => card.type === 'creature' && card.allowGameAction('destroy')
                    ),
                alwaysTriggers: true,
                may: 'repeat this effect',
                gameAction: ability.actions.resolveAbility({ ability: context.ability })
            })
        });
    }
}

BouncingDeathquark.id = 'bouncing-deathquark';

module.exports = BouncingDeathquark;
