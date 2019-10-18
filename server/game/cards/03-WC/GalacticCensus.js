const Card = require('../../Card.js');

class GalacticCensus extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.gainAmber(context => ({
                amount: (context.game.getHousesInPlay({ cardType: 'creature' }).length === 3 || context.game.getHousesInPlay({ cardType: 'creature' }).length === 4) ? 1 :
                    (context.game.getHousesInPlay({ cardType: 'creature' }).length === 5 ? 2 : (context.game.getHousesInPlay({ cardType: 'creature' }).length >= 6 ? 3 : 0))
            }))
        });
    }
}

GalacticCensus.id = 'galactic-census';

module.exports = GalacticCensus;
