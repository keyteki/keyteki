const Card = require('../../Card.js');

class KrisperRuld extends Card {
    // After Fight: Take control of an enemy artifact.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                activePromptTitle: 'Choose an enemy artifact',
                cardType: 'artifact',
                controller: 'opponent',
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.player)
                }))
            },
            effect: 'take control of {0}'
        });
    }
}

KrisperRuld.id = 'krisper-ruld';

module.exports = KrisperRuld;
