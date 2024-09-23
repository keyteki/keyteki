const Card = require('../../Card.js');

class NiceToGreetYou extends Card {
    // Play: Ready each Mars creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.ready((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.hasHouse('mars'))
            }))
        });
    }
}

NiceToGreetYou.id = 'nice-to-greet-you';

module.exports = NiceToGreetYou;
