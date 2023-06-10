const Card = require('../../Card.js');

class VaultsBlessing extends Card {
    // Play: Each player gains 1A for each Mutant creature they control.
    setupCardAbilities(ability) {
        this.play({
            effect: 'give each player 1A for each mutant creature they control',
            gameAction: [
                ability.actions.gainAmber((context) => ({
                    amount: context.player.creaturesInPlay.filter((card) => card.hasTrait('mutant'))
                        .length
                })),
                ability.actions.gainAmber((context) => ({
                    target: context.player.opponent,
                    amount: context.player.opponent
                        ? context.player.opponent.creaturesInPlay.filter((card) =>
                              card.hasTrait('mutant')
                          ).length
                        : 0
                }))
            ]
        });
    }
}

VaultsBlessing.id = 'vault-s-blessing';

module.exports = VaultsBlessing;
