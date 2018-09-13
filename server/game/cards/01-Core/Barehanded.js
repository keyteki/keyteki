const Card = require('../../Card.js');

class Barehanded extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.returnToDeck(context => ({ target: context.game.cardsInPlay(card => card.type === 'artifact') }))
        });
    }
}

Barehanded.id = 'barehanded'; // This is a guess at what the id might be - please check it!!!

module.exports = Barehanded;
