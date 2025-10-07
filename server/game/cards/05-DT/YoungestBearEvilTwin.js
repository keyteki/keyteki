import Card from '../../Card.js';

class YoungestBearEvilTwin extends Card {
    // Reap: You may fight with 1 of Youngest Bear's neighbors.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                controller: 'self',
                optional: true,
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.fight()
            }
        });
    }
}

YoungestBearEvilTwin.id = 'youngest-bear-evil-twin';

export default YoungestBearEvilTwin;
