const Card = require('../../Card.js');

class Solo extends Card {
    // If there are no other friendly creatures in play, Solo gets +20 power and gains, "After Fight: Gain 3."
    // Fate: Destroy each creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.player.creaturesInPlay.length === 1,
            effect: [
                ability.effects.modifyPower(20),
                ability.effects.gainAbility('fight', {
                    gameAction: ability.actions.gainAmber({ amount: 3 })
                })
            ]
        });

        this.fate({
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay
            }))
        });
    }
}

Solo.id = 'solo';

module.exports = Solo;
