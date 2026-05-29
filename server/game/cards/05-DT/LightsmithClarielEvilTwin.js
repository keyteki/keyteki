const Card = require('../../Card.js');

class LightsmithClarielEvilTwin extends Card {
    // Action: Switch a creature's power and armor for the remainder of the turn.
    setupCardAbilities(ability) {
        this.action({
            target: {
                optional: true,
                cardType: 'creature',
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: [
                        ability.effects.modifyPower(
                            (context.target?.armorPrinted || 0) -
                                (context.target?.powerPrinted || 0)
                        ),
                        ability.effects.modifyArmor(
                            (context.target?.powerPrinted || 0) -
                                (context.target?.armorPrinted || 0)
                        )
                    ]
                }))
            }
        });
    }
}

LightsmithClarielEvilTwin.id = 'lightsmith-clariel-evil-twin';

module.exports = LightsmithClarielEvilTwin;
