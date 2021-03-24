const Card = require('../../Card.js');

class EarlyBirds extends Card {
    //Alpha.
    //Play: Ready each Shadows card.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.ready((context) => ({
                target: context.game.cardsInPlay.filter((card) => card.hasHouse('shadows'))
            }))
        });
    }
}

EarlyBirds.id = 'early-birds';

module.exports = EarlyBirds;
