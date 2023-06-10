const Card = require('../../Card.js');

class SpoilsOfBattle extends Card {
    // Play: A friendly creature captures 1. Each creature with  on it captures 1 from its opponent.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'exactly',
                numCards: 1,
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture()
            },
            effect: 'capture 1 amber',
            gameAction: ability.actions.sequential([
                ability.actions.capture((context) => ({
                    target: context.player.creaturesInPlay.filter((card) => card.hasToken('amber'))
                })),
                ability.actions.capture((context) => ({
                    player: context.player,
                    target: context.player.opponent
                        ? context.player.opponent.creaturesInPlay.filter((card) =>
                              card.hasToken('amber')
                          )
                        : []
                }))
            ])
        });
    }
}

SpoilsOfBattle.id = 'spoils-of-battle';
module.exports = SpoilsOfBattle;
