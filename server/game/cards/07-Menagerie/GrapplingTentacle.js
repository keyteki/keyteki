const Card = require('../../Card.js');

class GrapplingTentacle extends Card {
    // If a friendly Legendary Keyraken is not in play, archive Grappling Tentacle.
    // Play: Capture 3.
    // Destroyed: Deal 3 to a friendly Legendary Keyraken.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.terminalCondition({
                condition: (context) =>
                    !context.source.controller.creaturesInPlay.some(
                        (card) => card.id === 'legendary-keyraken'
                    ),
                message: '{1} is archived as there is no friendly Legendary Keyraken',
                gameAction: ability.actions.archive()
            })
        });

        this.play({
            gameAction: ability.actions.capture({ amount: 3 }),
            message: '{0} uses {1} to capture {2} amber from {3}',
            messageArgs: (context) => [
                context.player,
                context.source,
                Math.min(3, context.player.opponent ? context.player.opponent.amber : 0),
                context.player.opponent
            ]
        });

        this.destroyed({
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.player.creaturesInPlay.find(
                    (card) => card.id === 'legendary-keyraken'
                ),
                amount: 3
            }))
        });
    }
}

GrapplingTentacle.id = 'grappling-tentacle';

module.exports = GrapplingTentacle;
