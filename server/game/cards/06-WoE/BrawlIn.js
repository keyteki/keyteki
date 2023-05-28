const Card = require('../../Card.js');

class BrawlIn extends Card {
    // Play: Make 2 token creatures. Enrage them.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature({
                amount: 2
            }),
            then: (preThenContext) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.enrage({
                    target: preThenContext.target
                })
            })
        });
    }
}

BrawlIn.id = 'brawl-in';

module.exports = BrawlIn;
