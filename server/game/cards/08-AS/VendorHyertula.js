const Card = require('../../Card.js');

class VendorHyertula extends Card {
    // After Reap: You may destroy Vendor Hyertula. If you do, take
    // control of an enemy artifact. While under your control, it
    // belongs to house Ekwidon.
    setupCardAbilities(ability) {
        this.reap({
            optional: true,
            gameAction: ability.actions.destroy(),
            then: {
                target: {
                    cardType: 'artifact',
                    controller: 'opponent',
                    gameAction: ability.actions.cardLastingEffect((context) => ({
                        duration: 'lastingEffect',
                        effect: ability.effects.takeControl(context.player)
                    }))
                },
                message: '{0} uses {1} to take control of {3}',
                messageArgs: (context) => [context.target],
                then: (context) => ({
                    gameAction: ability.actions.cardLastingEffect({
                        target: context.target,
                        duration: 'lastingEffect',
                        until: {
                            onTakeControl: (event) =>
                                event.card === context.target &&
                                event.player === context.player.opponent
                        },
                        effect: ability.effects.changeHouse('ekwidon')
                    })
                })
            }
        });
    }
}

VendorHyertula.id = 'vendor-hyertula';

module.exports = VendorHyertula;
