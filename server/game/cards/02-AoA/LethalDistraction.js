const Card = require('../../Card.js');

class LethalDistraction extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.bonusDamage(2)
                })
            },
            effect: 'make {0} take 2 extra damage whenever they take damage'
        });
    }
}

LethalDistraction.id = 'lethal-distraction';

module.exports = LethalDistraction;
