const Card = require('../../Card.js');

class CrushingTentacle extends Card {
    // Assault 3.
    // If a friendly Legendary Keyraken is not in play, archive Crushing Tentacle.
    // Destroyed: Deal 3D to a friendly Legendary Keyraken.
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

CrushingTentacle.id = 'crushing-tentacle';

module.exports = CrushingTentacle;
