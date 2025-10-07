import Card from '../../Card.js';

class Cleric extends Card {
    // When cleric enters play, capture 1A
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.capture((context) => ({
                amount: 1,
                target: context.event.card
            }))
        });
    }
}

Cleric.id = 'cleric';

export default Cleric;
