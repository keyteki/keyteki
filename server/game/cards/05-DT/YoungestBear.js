import Card from '../../Card.js';

class YoungestBear extends Card {
    // Reap: You may reap with 1 of Youngest Bear's neighbors.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'self',
                optional: true,
                cardCondition: (card, context) =>
                    card.exhausted === false && context.source.neighbors.includes(card),
                gameAction: ability.actions.reap()
            }
        });
    }
}

YoungestBear.id = 'youngest-bear';

export default YoungestBear;
