const Card = require('../../Card.js');

class QuintrinoFlux extends Card {
    setupCardAbilities(ability) {
        this.play({
            targets: {
                friendly: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.destroy(context => ({
                        target: context.targets.friendly ? context.game.creaturesInPlay.filter(card => card.power === context.targets.friendly.power) : []
                    }))
                },
                enemy: {
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.destroy(context => ({
                        target: context.targets.enemy ? context.game.creaturesInPlay.filter(card => card.power === context.targets.enemy.power) : []
                    }))
                }
            },
            effect: 'destroy {1}',
            effectArgs: context => [context.game.creaturesInPlay.filter(card => (context.targets.friendly && (card.power === context.targets.friendly.power)) ||
                (context.targets.enemy && (card.power === context.targets.enemy.power)))]
        });
    }
}

QuintrinoFlux.id = 'quintrino-flux';

module.exports = QuintrinoFlux;
