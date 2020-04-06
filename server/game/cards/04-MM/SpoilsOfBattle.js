const Card = require('../../Card.js');

class SpoilsOfBattle extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'exactly',
                numCards: 1,
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.capture()
            },
            gameAction: [
                ability.actions.capture(context => ({
                    target: context.player.creaturesInPlay.filter(card => card.hasToken('amber'))
                })),
                ability.actions.capture(context => ({
                    player: context.player,
                    target: context.player.opponent.creaturesInPlay.filter(card => card.hasToken('amber'))
                }))
            ]
        });
    }
}

SpoilsOfBattle.id = 'spoils-of-battle';
module.exports = SpoilsOfBattle;
