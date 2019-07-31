const Card = require('../../Card.js');

class ShadowOfDis extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            effect: 'blank {1}\'s creatures text boxes',
            effectArgs: context => context.player.opponent,
            gameAction: ability.actions.cardLastingEffect(context => ({
                duration: 'untilNextTurn',
                target: context.player.opponent.creaturesInPlay,
                effect: ability.effects.blank()
            }))
        });
    }
}

ShadowOfDis.id = 'shadow-of-dis';

module.exports = ShadowOfDis;
