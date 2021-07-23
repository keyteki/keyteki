const Card = require('../../Card.js');

class Foggify extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'stop {1} from fighting next turn',
            effectArgs: (context) => context.player.opponent,
            effectAlert: true,
            gameAction: ability.actions.nextRoundEffect({
                targetController: 'opponent',
                effect: ability.effects.cardCannot('fight')
            })
        });
    }
}

Foggify.id = 'foggify';

module.exports = Foggify;
