const Card = require('../../Card.js');

class TrustNoOne extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal(context => ({
                amount: context.player.creaturesInPlay.length !== 0 ? 1 : Math.min(3, context.player.opponent ? context.game.getHousesInPlay(context.player.opponent.creaturesInPlay).length : 0)
            }))
        });
    }
}

TrustNoOne.id = 'trust-no-one';

module.exports = TrustNoOne;
