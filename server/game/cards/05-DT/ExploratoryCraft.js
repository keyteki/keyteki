import Card from '../../Card.js';

class ExploratoryCraft extends Card {
    // Action: Exhaust up to 3 friendly creatures. For each house represented among creatures exhausted this way, draw a card.
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'upTo',
                numCards: 3,
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => !card.exhausted,
                gameAction: ability.actions.exhaust()
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.draw({
                    amount: new Set(preThenContext.target.map((card) => card.getHouses()).flat())
                        .size
                })
            })
        });
    }
}

ExploratoryCraft.id = 'exploratory-craft';

export default ExploratoryCraft;
