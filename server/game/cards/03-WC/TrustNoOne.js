const Card = require('../../Card.js');

class TrustNoOne extends Card {
    // Play: Steal 1A. If there are no friendly creatures in play, instead steal 1A for each house represented among enemy creatures (to a maximum of 3).
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal((context) => ({
                amount:
                    context.player.creaturesInPlay.length !== 0
                        ? 1
                        : Math.min(
                              3,
                              context.player.opponent
                                  ? context.game.getHousesInPlay(
                                        context.player.opponent.creaturesInPlay
                                    ).length
                                  : 0
                          )
            }))
        });
    }
}

TrustNoOne.id = 'trust-no-one';

module.exports = TrustNoOne;
