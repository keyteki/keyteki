const Card = require('../../Card.js');

class TheEvilEye extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: "increase {1}'s key cost by 3 until the end of their next turn",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost(3)
            })
        });
    }
}

TheEvilEye.id = 'the-evil-eye';

module.exports = TheEvilEye;
