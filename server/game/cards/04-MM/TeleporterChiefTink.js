const Card = require('../../Card.js');

class TeleporterChiefTink extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Action: Swap Teleporter Chief Tink with another friendly creature in the battleline. You may use that other creature this turn.
    setupCardAbilities(ability) {
        this.action({
            condition: (context) => context.player.creaturesInPlay.length > 1,
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.swap()
            },
            effect: 'swap its position with {0}. You may use {0} this turn',
            gameAction: ability.actions.forRemainderOfTurn((abilityContext) => ({
                effect: ability.effects.canUse((card) => card === abilityContext.target)
            }))
        });
    }
}

TeleporterChiefTink.id = 'teleporter-chief-tink';

module.exports = TeleporterChiefTink;
