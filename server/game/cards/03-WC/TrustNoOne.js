const Constants = require('../../../constants.js');
const Card = require('../../Card.js');

class TrustNoOne extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal(context => ({
                amount: context.player.creaturesInPlay.length !== 0 ? 1 : Math.min(3, Constants.Houses.filter(house => context.player.opponent.creaturesInPlay.some(card => card.hasHouse(house))).length)
            }))
        });
    }
}

TrustNoOne.id = 'trust-no-one';

module.exports = TrustNoOne;
