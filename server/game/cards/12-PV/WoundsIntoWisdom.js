import Card from '../../Card.js';

class WoundsIntoWisdom extends Card {
    // During your opponent's turn, after a friendly creature is dealt damage, fulfill Wounds into Wisdom.
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                onDamageDealt: (event, context) =>
                    context.game.activePlayer === context.source.controller.opponent &&
                    event.clone.controller === context.source.controller &&
                    event.clone.type === 'creature'
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

WoundsIntoWisdom.id = 'wounds-into-wisdom';

export default WoundsIntoWisdom;
