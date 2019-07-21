const Card = require('../../Card.js');

class BarristerJoya extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'stop {1} from reaping with creatures while she is in play.',
            effectArgs: context => context.player.opponent,
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.cardCannot('reap')
            })
        });
    }
}

BarristerJoya.id = 'barrister-joya';

module.exports = BarristerJoya;
