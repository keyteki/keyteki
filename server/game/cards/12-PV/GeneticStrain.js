const Card = require('../../Card.js');

class GeneticStrain extends Card {
    // Play: Each Mutant captures 1A.
    // Fate: If there are any enemy Mutant creatures, your opponent gains 2A.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.sequential([
                ability.actions.capture((context) => ({
                    target: context.player.creaturesInPlay.filter((card) => card.hasTrait('mutant'))
                })),
                ability.actions.capture((context) => ({
                    player: context.player,
                    target: context.player.opponent
                        ? context.player.opponent.creaturesInPlay.filter((card) =>
                              card.hasTrait('mutant')
                          )
                        : []
                }))
            ]),
            effect: 'capture 1 amber on each Mutant creature'
        });

        this.fate({
            condition: (context) =>
                context.game.activePlayer.opponent.creaturesInPlay.some((card) =>
                    card.hasTrait('mutant')
                ),
            gameAction: ability.actions.gainAmber((context) => ({
                target: context.game.activePlayer.opponent,
                amount: 2
            }))
        });
    }
}

GeneticStrain.id = 'genetic-strain';

module.exports = GeneticStrain;
