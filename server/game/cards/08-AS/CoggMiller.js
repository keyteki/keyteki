const Card = require('../../Card.js');

class CoggMiller extends Card {
    // After Fight: You may destroy an artifact. If you do, its owner
    // archives a random card from their hand.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                optional: true,
                cardType: 'artifact',
                gameAction: ability.actions.destroy()
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.archiveAtRandom({
                    target: preThenContext.target.owner,
                    amount: 1
                })
            })
        });
    }
}

CoggMiller.id = 'cogg-miller';

module.exports = CoggMiller;
