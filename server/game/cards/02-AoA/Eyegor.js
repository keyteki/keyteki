const Card = require('../../Card.js');

class Eyegor extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.deckSearch({
                amount: 3,
                reveal: false
            }),
            then: {
                gameAction: ability.actions.discard(context => ({
                    target: context.player.deck.slice(0, 2)
                }))
            }
        });
    }
}

Eyegor.id = 'eyegor';

module.exports = Eyegor;
