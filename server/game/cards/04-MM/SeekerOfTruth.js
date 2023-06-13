const Card = require('../../Card.js');

class SeekerOfTruth extends Card {
    // Fight: You may fight with a friendly non-Sanctum creature.
    setupCardAbilities(ability) {
        this.fight({
            optional: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => !card.exhausted && !card.hasHouse('sanctum'),
                gameAction: ability.actions.fight()
            },
            effect: 'fight with a friendly non-Sanctum creature'
        });
    }
}

SeekerOfTruth.id = 'seeker-of-truth';

module.exports = SeekerOfTruth;
