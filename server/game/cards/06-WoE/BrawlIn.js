import Card from '../../Card.js';

class BrawlIn extends Card {
    // Play: Make 2 token creatures. Enrage them.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature({
                amount: 2
            }),
            then: {
                gameAction: ability.actions.enrage((context) => ({
                    target: context.preThenEvents.map((event) => event.card)
                }))
            }
        });
    }
}

BrawlIn.id = 'brawl-in';

export default BrawlIn;
