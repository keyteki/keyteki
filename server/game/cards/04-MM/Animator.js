const Card = require('../../Card.js');

class Animator extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'artifact',
                gameAction: ability.actions.sequential([
                    ability.actions.cardLastingEffect((context) => ({
                        effect: [
                            ability.effects.changeType('creature'),
                            ability.effects.changeHouse(context.player.activeHouse)
                        ].concat(
                            context.target && context.target.type === 'artifact'
                                ? ability.effects.modifyPower(3)
                                : []
                        )
                    })),
                    ability.actions.moveToFlank()
                ])
            }
        });
    }
}

Animator.id = 'animator';

module.exports = Animator;
