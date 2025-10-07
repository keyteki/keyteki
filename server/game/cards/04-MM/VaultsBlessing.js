import Card from '../../Card.js';

class VaultsBlessing extends Card {
    // Play: Each player gains 1A for each Mutant creature they control.
    setupCardAbilities(ability) {
        this.play({
            effect:
                'have each player gain 1 amber for each mutant creature they control, {1} gains a total of {2} amber ({3}) and {4} gains a total of {5} amber ({6})',
            effectArgs: (context) => [
                context.player,
                context.player.creaturesInPlay.filter((card) => card.hasTrait('mutant')).length,
                context.player.creaturesInPlay.filter((card) => card.hasTrait('mutant')),
                context.player.opponent,
                context.player.opponent
                    ? context.player.opponent.creaturesInPlay.filter((card) =>
                          card.hasTrait('mutant')
                      ).length
                    : 0,
                context.player.opponent
                    ? context.player.opponent.creaturesInPlay.filter((card) =>
                          card.hasTrait('mutant')
                      )
                    : []
            ],
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

export default VaultsBlessing;
