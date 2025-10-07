import Card from '../../Card.js';

class LightsmithClariel extends Card {
    // Before Fight: You may switch Lightsmith Clariel's power and armor for the remainder of the turn.
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

export default LightsmithClariel;
