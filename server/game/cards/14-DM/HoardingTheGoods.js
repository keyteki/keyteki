const Card = require('../../Card.js');

class HoardingTheGoods extends Card {
    // Play: Each friendly exhausted creature captures 1.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture((context) => ({
                amount: 1,
                target: context.player.creaturesInPlay.filter((card) => card.exhausted)
            })),
            effect: 'have each friendly exhausted creature capture 1 amber'
        });
    }
}

HoardingTheGoods.id = 'hoarding-the-goods';

module.exports = HoardingTheGoods;
