const Card = require('../../Card.js');

class Pandemonium extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'cause each undamaged creature to capture 1 amber from their opponent',
            gameAction: [
                ability.actions.capture((context) => ({
                    target: context.player.creaturesInPlay.filter(
                        (card) => !card.hasToken('damage')
                    )
                })),
                ability.actions.capture((context) => ({
                    player: context.player,
                    target: context.player.opponent.creaturesInPlay.filter(
                        (card) => !card.hasToken('damage')
                    )
                }))
            ]
        });
    }
}

Pandemonium.id = 'pandemonium';

module.exports = Pandemonium;
