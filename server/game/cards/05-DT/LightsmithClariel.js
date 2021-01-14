const Card = require('../../Card.js');

class LightsmithClariel extends Card {
    //Before Fight: You may swap the power and armor values of Lightsmith Clariel for the remainder of the turn.
    setupCardAbilities(ability) {
        this.beforeFight({
            optional: true,
            gameAction: ability.actions.cardLastingEffect({
                effect: [ability.effects.modifyPower(-3), ability.effects.modifyArmor(3)]
            })
        });
    }
}

LightsmithClariel.id = 'lightsmith-clariel';

module.exports = LightsmithClariel;
