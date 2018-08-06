const Card = require('../../Card.js');

class Foggify extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.playerLastingEffect({
                targetController: 'opponent',
                duration: 'untilEndOfOpponentsTurn',
                effect: ability.effects.playerCannot('fight')
            })
        });
    }
}

Foggify.id = 'foggify'; // This is a guess at what the id might be - please check it!!!

module.exports = Foggify;
