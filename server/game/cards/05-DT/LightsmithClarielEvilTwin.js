import Card from '../../Card.js';

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
                            context.target.getArmor(true) - context.target.getPower(true)
                        ),
                        ability.effects.modifyArmor(
                            context.target.getPower(true) - context.target.getArmor(true)
                        )
                    ]
                }))
            }
        });
    }
}

LightsmithClarielEvilTwin.id = 'lightsmith-clariel-evil-twin';

export default LightsmithClarielEvilTwin;
