const Card = require('../../Card.js');

class BouncingDeathquark extends Card {
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
            then: context => ({
                condition: () =>
                    context.player.cardsInPlay.some(card => card.type === 'creature' && card.allowGameAction('destroy')) &&
                    context.player.opponent &&
                    context.player.opponent.cardsInPlay.some(card => card.type === 'creature' && card.allowGameAction('destroy')),
                alwaysTriggers: true,
                may: 'repeat this effect',
                gameAction: ability.actions.resolveAbility({ ability: context.ability })
            })
        });
    }
}

BouncingDeathquark.id = 'bouncing-deathquark'; // This is a guess at what the id might be - please check it!!!

module.exports = BouncingDeathquark;
