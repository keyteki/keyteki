const Card = require('../../Card.js');

class SoundTheHorns extends Card {
    // Play: Discard cards from the top of your deck until you either discard a Brobnar creature or run out of cards. If you discarded a Brobnar creature this way, put it into your hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => {
                let deck = context.player.deck;
                let index = deck.findIndex(
                    (card) => card.type === 'creature' && card.hasHouse('brobnar')
                );
                if (index > -1) {
                    return { target: deck.slice(0, index + 1) };
                }

                return { target: deck };
            }),
            then: (context) => {
                let card = context.player.deck.find(
                    (card) => card.type === 'creature' && card.hasHouse('brobnar')
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

SoundTheHorns.id = 'sound-the-horns';

module.exports = SoundTheHorns;
