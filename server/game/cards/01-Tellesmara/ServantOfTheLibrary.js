const Card = require('../../Card.js');

class ServantOfTheLibrary extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'Draw a card.',
            gameAction: ability.actions.draw()
        });
    }
}

ServantOfTheLibrary.id = 'servantofthelibrary';

module.exports = ServantOfTheLibrary;
