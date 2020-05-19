const Card = require('../../Card.js');

class Hecatomb extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect:
                'destroy all dis creatures and each player gains amber equal to the number of their creatures destroyed',
            gameAction: [
                ability.actions.destroy((context) => ({
                    target: context.game.creaturesInPlay.filter((card) => card.hasHouse('dis'))
                })),
                ability.actions.gainAmber((context) => ({
                    amount: context.player.creaturesInPlay.filter((card) => card.hasHouse('dis'))
                        .length
                })),
                ability.actions.gainAmber((context) => ({
                    target: context.player.opponent,
                    amount: context.player.opponent
                        ? context.player.opponent.creaturesInPlay.filter((card) =>
                              card.hasHouse('dis')
                          ).length
                        : 0
                }))
            ]
        });
    }
}

Hecatomb.id = 'hecatomb';

module.exports = Hecatomb;
