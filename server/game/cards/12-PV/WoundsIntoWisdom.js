const Card = require('../../Card.js');

class WoundsIntoWisdom extends Card {
    // During your opponent's turn, after a friendly creature is dealt damage, fulfill Wounds into Wisdom.
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                onDamageDealt: (event, context) =>
                    context.game.activePlayer === context.source.controller.opponent &&
                    event.card.controller === context.source.controller &&
                    event.card.type === 'creature'
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

WoundsIntoWisdom.id = 'wounds-into-wisdom';

module.exports = WoundsIntoWisdom;
