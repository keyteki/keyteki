import Card from '../../Card.js';

class DesignerCrick extends Card {
    // Each time your opponent discards a card from their hand, draw a card and Designer Crick captures 1.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.location === 'hand' && event.card.controller !== context.source.controller
            },
            gameAction: [ability.actions.draw(), ability.actions.capture()],
            message: '{0} uses {1} to draw a card and capture 1 amber',
            messageArgs: (context) => [context.player, context.source]
        });
    }
}

DesignerCrick.id = 'designer-crick';

export default DesignerCrick;
