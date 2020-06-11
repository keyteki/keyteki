const Card = require('../../Card.js');

class MutationOfInstinct extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'give {0} skirmish and Mutant trait',
            target: {
                cardType: 'creature',
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilNextTurn',
                    effect: [
                        ability.effects.addKeyword({ skirmish: 1 }),
                        ability.effects.addTrait('mutant')
                    ]
                })
            }
        });
    }
}

MutationOfInstinct.id = 'mutation-of-instinct';

module.exports = MutationOfInstinct;
