const Card = require('../../Card.js');

class TurBoProp extends Card {
    // After Reap: If a blue key is forged, draw 2 cards. Otherwise, draw a card.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.draw((context) => ({
                amount: context.game.isKeyForged('blue') ? 2 : 1
            }))
        });
    }
}

TurBoProp.id = 'tur-bo-prop';

module.exports = TurBoProp;
