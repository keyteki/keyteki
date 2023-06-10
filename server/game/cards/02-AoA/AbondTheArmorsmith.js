const Card = require('../../Card.js');

class AbondTheArmorsmith extends Card {
    // Other friendly creatures get +1armor.
    // Action: For the remainder of the turn, other friendly creatures get +1armor.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            match: (card, context) => card !== context.source,
            effect: ability.effects.modifyArmor(1)
        });
        this.action({
            effect: 'each other friendly creature gets +1 armor',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                target: context.player.creaturesInPlay.filter((card) => card !== context.source),
                effect: ability.effects.modifyArmor(1)
            }))
        });
    }
}

AbondTheArmorsmith.id = 'abond-the-armorsmith';

module.exports = AbondTheArmorsmith;
