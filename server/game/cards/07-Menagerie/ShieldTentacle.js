const Card = require('../../Card.js');

class ShieldTentacle extends Card {
    // Deploy. Taunt.
    // If a friendly Legendary Keyraken is not in play, archive Shield Tentacle.
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

ShieldTentacle.id = 'shield-tentacle';

module.exports = ShieldTentacle;
