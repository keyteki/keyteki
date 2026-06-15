const { shuffle } = require('../../../Array.js');
const Card = require('../../Card.js');

class AdultSwim extends Card {
    //Play: Put each creature with power 3 or lower on top of its owner's deck in a random order.
    setupCardAbilities(ability) {
        this.play({
            effect: "randomly put each creature with power 3 or lower on top of its owner's deck",
            gameAction: ability.actions.returnToDeck((context) => ({
                target: shuffle(context.game.creaturesInPlay.filter((card) => card.power <= 3))
            }))
        });
    }
}

AdultSwim.id = 'adult-swim';

module.exports = AdultSwim;
