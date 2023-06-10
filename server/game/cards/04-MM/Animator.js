const Card = require('../../Card.js');

class Animator extends Card {
    // Action: Move an artifact to a flank of its controllers battleline. For the remainder of the turn, it is a creature with 3 power that belongs to the active house. (It leaves the battleline when its no longer a creature.)
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
