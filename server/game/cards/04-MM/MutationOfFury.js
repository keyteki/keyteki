const Card = require('../../Card.js');

class MutationOfFury extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'give {0} assault 3 and Mutant trait',
            target: {
                cardType: 'creature',
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilNextTurn',
                    effect: [
                        ability.effects.addKeyword({ assault: 3 }),
                        ability.effects.addTrait('mutant')
                    ]
                })
            }
        });
    }
}

MutationOfFury.id = 'mutation-of-fury';

module.exports = MutationOfFury;
