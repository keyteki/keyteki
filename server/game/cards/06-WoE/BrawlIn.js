const Card = require('../../Card.js');

class BrawlIn extends Card {
    // Play: Make 2 token creatures. Enrage them.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature({
                amount: 2
            }),
            then: {
                gameAction: ability.actions.enrage((context) => ({
                    target: context.preThenEvent.cards
                }))
            }
        });
    }
}

BrawlIn.id = 'brawl-in';

module.exports = BrawlIn;
