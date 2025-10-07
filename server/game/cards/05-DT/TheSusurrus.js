import Card from '../../Card.js';

class TheSusurrus extends Card {
    // Action: Exhaust a friendly Unfathomable creature. If you do, exhaust up to 3 creatures and/or artifacts.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card) => card.hasHouse('unfathomable'),
                gameAction: ability.actions.exhaust()
            },
            then: {
                target: {
                    mode: 'upTo',
                    numCards: 3,
                    cardCondition: (card) => card.type === 'creature' || card.type === 'artifact',
                    gameAction: ability.actions.exhaust()
                }
            }
        });
    }
}

TheSusurrus.id = 'the-susurrus';

export default TheSusurrus;
