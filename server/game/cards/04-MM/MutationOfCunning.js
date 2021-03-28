const Card = require('../../Card.js');

class MutationOfCunning extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'give {0} elusive and Mutant trait',
            target: {
                cardType: 'creature',
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilNextTurn',
                    effect: [
                        ability.effects.addKeyword({ elusive: 1 }),
                        ability.effects.addTrait('mutant')
                    ]
                })
            }
        });
    }
}

MutationOfCunning.id = 'mutation-of-cunning';

module.exports = MutationOfCunning;
