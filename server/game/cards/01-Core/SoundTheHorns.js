const Card = require('../../Card.js');

class SoundTheHorns extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard(context => {
                let deck = context.player.deck;
                let index = deck.findIndex(card => card.type === 'creature' && card.hasHouse('mars'));
                if(index > -1) {
                    return { target: deck.slice(0, index + 1) };
                }
                return { target: deck };
            }),
            then: context => {
                let card = context.player.deck.find(card => card.type === 'creature' && card.hasHouse('mars'));
                if(card) {
                    return {
                        message: '{0} takes {3} into their hand',
                        messageArgs: card,
                        gameAction: ability.actions.returnToHand({ target: card, location: 'discard' })
                    };
                }
            }
        });
    }
}

SoundTheHorns.id = 'sound-the-horns'; // This is a guess at what the id might be - please check it!!!

module.exports = SoundTheHorns;
