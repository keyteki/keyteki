const Card = require('../../Card.js');

class AeroOFore extends Card {
    // While Aero O'Fore is in the center of your battleline, it
    // gains, “After Reap: You may rearrange other friendly creatures
    // in your battleline. Each friendly flank creature captures 2A.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isInCenter(),
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.rearrangeBattleline((context) => ({
                    player: context.player
                })),
                then: {
                    alwaysTriggers: true,
                    gameAction: ability.actions.capture((context) => ({
                        amount: 2,
                        target: context.player.creaturesInPlay.filter((card) => card.isOnFlank())
                    })),
                    message: '{0} uses {1} to capture 2 amber onto {3}',
                    messageArgs: (context) => [
                        context.player.creaturesInPlay.filter((card) => card.isOnFlank())
                    ]
                }
            })
        });
    }
}

AeroOFore.id = 'aero-o-fore';

module.exports = AeroOFore;
