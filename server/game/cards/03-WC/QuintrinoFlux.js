const Card = require('../../Card.js');

class QuintrinoFlux extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                friendly: {
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.destroy()
                },
                enemy: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.destroy()
                }
            },
            effect: 'destroy {1}',
            effectArgs: context => [[context.targets.enemy, context.targets.friendly]],
            then: (preThenContext) => ({
                gameAction: [
                    ability.actions.destroy({
                        target: preThenContext.game.creaturesInPlay.filter(card => card.power === preThenContext.targets.friendly.power)
                    }),
                    ability.actions.destroy({
                        target: preThenContext.game.creaturesInPlay.filter(card => card.power === preThenContext.targets.enemy.power)
                    })
                ]
            })
        });
    }
}

QuintrinoFlux.id = 'quintrino-flux';

module.exports = QuintrinoFlux;
