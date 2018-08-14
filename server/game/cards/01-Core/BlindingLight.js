const Card = require('../../Card.js');

class BlindingLight extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'house'
            },
            gameAction: ability.actions.stun(context => ({ target: context.game.cardsInPlay.filter(card => card.house === context.house) }))
        });
    }
}

BlindingLight.id = 'blinding-light'; // This is a guess at what the id might be - please check it!!!

module.exports = BlindingLight;
