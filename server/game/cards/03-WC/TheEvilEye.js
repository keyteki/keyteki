const Card = require('../../Card.js');

class TheEvilEye extends Card {
    // Play: Keys cost +3A during your opponents next turn.
    setupCardAbilities(ability) {
        this.play({
            effect: "increase key cost by 3 during {1}'s next turn",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.nextRoundEffect({
                targetController: 'any',
                effect: ability.effects.modifyKeyCost(3)
            })
        });
    }
}

TheEvilEye.id = 'the-evil-eye';

module.exports = TheEvilEye;
