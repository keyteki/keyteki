import Card from '../../Card.js';

class TheForsaken extends Card {
    // Each time your opponent discards a card from their hand, make a token
    // creature on your left flank.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.location === 'hand' && event.card.controller !== context.source.controller
            },
            gameAction: ability.actions.makeTokenCreature({
                deployIndex: -1 // Left flank
            })
        });
    }
}

TheForsaken.id = 'the-forsaken';

export default TheForsaken;
