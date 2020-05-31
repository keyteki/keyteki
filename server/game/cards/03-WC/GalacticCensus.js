const Card = require('../../Card.js');

class GalacticCensus extends Card {
    getAmountForHouses(houses) {
        switch (houses.length) {
            case 0:
            case 1:
            case 2:
                return 0;
            case 3:
            case 4:
                return 1;
            case 5:
                return 2;
            default:
                return 3;
        }
    }

    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.gainAmber((context) => ({
                amount: this.getAmountForHouses(
                    context.game.getHousesInPlay(context.game.creaturesInPlay)
                )
            }))
        });
    }
}

GalacticCensus.id = 'galactic-census';

module.exports = GalacticCensus;
