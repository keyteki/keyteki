import Card from '../../Card.js';

class Yardbird extends Card {
    // Before Fight: Ready another Yardbird.
    setupCardAbilities(ability) {
        this.beforeFight({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) =>
                    card !== context.source && card.name === 'Yardbird',
                gameAction: ability.actions.ready()
            }
        });
    }
}

Yardbird.id = 'yardbird';

export default Yardbird;
