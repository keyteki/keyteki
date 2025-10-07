import Card from '../../Card.js';

class DrXyloxxzlphrex extends Card {
    // After Reap: Play a Mars creature from your discard pile and ready it.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardCondition: (c) => c.hasHouse('mars'),
                cardType: 'creature',
                controller: 'self',
                location: 'discard',
                gameAction: ability.actions.playCard()
            },
            then: {
                gameAction: ability.actions.ready((context) => ({
                    target: context.preThenEvents.map((event) => event.card)
                }))
            }
        });
    }
}

DrXyloxxzlphrex.id = 'dr-xyloxxzlphrex';

export default DrXyloxxzlphrex;
