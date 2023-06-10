const Card = require('../../Card.js');

class AngryMob extends Card {
    // Before Fight: You may discard cards from the top of your deck until you discard an Angry Mob or run out of cards. If you discard an Angry Mob this way, put it into your hand.
    setupCardAbilities(ability) {
        this.beforeFight({
            optional: true,
            gameAction: ability.actions.discard((context) => {
                let deck = context.player.deck;
                let index = deck.findIndex((card) => card.id === 'angry-mob');
                if (index > -1) {
                    return { target: deck.slice(0, index + 1) };
                }

                return { target: deck };
            }),
            then: (context) => {
                let card = context.player.deck.find((card) => card.id === 'angry-mob');
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

AngryMob.id = 'angry-mob';

module.exports = AngryMob;
