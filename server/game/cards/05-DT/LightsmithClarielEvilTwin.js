const Card = require('../../Card.js');

class LightsmithClarielEvilTwin extends Card {
    //Action: You may swap the power and armor values of a creature.
    //This card has been translated from Chinese and is subject to change.
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

module.exports = LightsmithClarielEvilTwin;
