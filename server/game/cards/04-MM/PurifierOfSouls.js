const Card = require('../../Card.js');

class PurifierOfSouls extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: () => true,
            effect: ability.effects.cardCannot(
                'triggerAbilities',
                (context) => !!context.ability.properties.destroyed
            )
        });
    }
}

PurifierOfSouls.id = 'purifier-of-souls';

module.exports = PurifierOfSouls;
