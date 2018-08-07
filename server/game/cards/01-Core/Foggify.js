const Card = require('../../Card.js');

class Foggify extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.cardCannot('fight')
            })
        });
    }
}

Foggify.id = 'foggify'; // This is a guess at what the id might be - please check it!!!

module.exports = Foggify;
