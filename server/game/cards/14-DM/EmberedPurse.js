const Card = require('../../Card.js');

class EmberedPurse extends Card {
    // Play: Steal 1 for each ready Skyborn creature in play.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.steal((context) => ({
                amount: context.game.creaturesInPlay.filter(
                    (card) => !card.exhausted && card.hasHouse('skyborn')
                ).length
            }))
        });
    }
}

EmberedPurse.id = 'embered-purse';

module.exports = EmberedPurse;
