const Card = require('../../Card.js');

class ShadowOfDis extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            effect: 'blank {1}\'s creatures text boxes',
            effectArgs: context => context.player.opponent,
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.blank(context => ({
                    target: context.player.cardsInPlay(card => card.type === 'creature')
                }))
            })
        });
    }
}

ShadowOfDis.id = 'shadow-of-dis';

module.exports = ShadowOfDis;
