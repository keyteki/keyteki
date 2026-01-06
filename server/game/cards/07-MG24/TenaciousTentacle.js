const Card = require('../../Card.js');

class TenaciousTentacle extends Card {
    // If a friendly Legendary Keyraken is not in play, archive Tenacious Tentacle.
    // After Reap: Steal 1.
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

        this.reap({
            gameAction: ability.actions.steal()
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

TenaciousTentacle.id = 'tenacious-tentacle';

module.exports = TenaciousTentacle;
