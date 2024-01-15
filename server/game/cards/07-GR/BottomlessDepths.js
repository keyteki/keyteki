const Card = require('../../Card.js');

class BottomlessDepths extends Card {
    // Each time you discard a card from your hand, put that card
    // facedown under Bottomless Depths from your discard pile.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, context) =>
                    event.location === 'hand' && event.card.controller === context.source.controller
            },
            gameAction: ability.actions.placeUnder((context) => ({
                target: context.event.card,
                parent: context.source,
                facedown: true
            }))
        });
    }
}

BottomlessDepths.id = 'bottomless-depths';

module.exports = BottomlessDepths;
