const Card = require('../../Card.js');

class InvasionPortal extends Card {
    setupCardAbilities(ability) {
        this.action({
            gameAction: ability.actions.discard((context) => {
                let deck = context.player.deck;
                let index = deck.findIndex(
                    (card) => card.type === 'creature' && card.hasHouse('mars')
                );
                if (index > -1) {
                    return { target: deck.slice(0, index + 1) };
                }

                return { target: deck };
            }),
            then: (context) => {
                let card = context.player.deck.find(
                    (card) => card.type === 'creature' && card.hasHouse('mars')
                );
                if (card) {
                    return {
                        message: '{0} takes {3} into their hand',
                        messageArgs: card,
                        gameAction: ability.actions.returnToHand({
                            target: card,
                            location: 'discard'
                        })
                    };
                }
            }
        });
    }
}

InvasionPortal.id = 'invasion-portal';

module.exports = InvasionPortal;
