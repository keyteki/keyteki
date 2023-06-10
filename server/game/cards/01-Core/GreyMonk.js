const Card = require('../../Card.js');

class GreyMonk extends Card {
    // Each friendly creature gets +1 armor.
    // Reap: Heal 2 damage from a creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            match: () => true,
            effect: ability.effects.modifyArmor(1)
        });
        this.reap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.heal({ amount: 2 })
            }
        });
    }
}

GreyMonk.id = 'grey-monk';

module.exports = GreyMonk;
