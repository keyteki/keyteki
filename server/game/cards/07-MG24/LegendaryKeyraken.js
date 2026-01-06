const Card = require('../../Card.js');

class LegendaryKeyraken extends Card {
    // Legendary Keyraken gets +5 power for each forged key you have.
    // After Reap: Forge a key at +6A current cost, reduced by 1A for each friendly Tentacle in play.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.modifyPower((card) => card.controller.getForgedKeys() * 5)
        });

        this.reap({
            gameAction: ability.actions.forgeKey((context) => ({
                modifier:
                    6 -
                    context.player.creaturesInPlay.filter((card) => card.hasTrait('tentacle'))
                        .length
            }))
        });
    }
}

LegendaryKeyraken.id = 'legendary-keyraken';

module.exports = LegendaryKeyraken;
