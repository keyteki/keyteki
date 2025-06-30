const Card = require('../../Card.js');

class BellatoranRecruiter extends Card {
    // Enhance .
    // After Fight/After Reap: Choose a friendly non-Dinosaur creature. For the remainder of the turn, that creature gets +2 power and +2 armor. Ready and fight with that creature.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => !card.hasTrait('dinosaur'),
                gameAction: ability.actions.sequential([
                    ability.actions.cardLastingEffect({
                        effect: [ability.effects.modifyPower(2), ability.effects.modifyArmor(2)]
                    }),
                    ability.actions.ready(),
                    ability.actions.fight()
                ])
            },
            effect:
                'give {0} +2 power and +2 armor for the remainder of the turn, then ready and fight with it'
        });
    }
}

BellatoranRecruiter.id = 'bellatoran-recruiter';

module.exports = BellatoranRecruiter;
