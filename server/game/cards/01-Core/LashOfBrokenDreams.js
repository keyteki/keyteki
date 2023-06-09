const Card = require('../../Card.js');

class LashOfBrokenDreams extends Card {
    // Action: Keys cost +3A during your opponents next turn.
    setupCardAbilities(ability) {
        this.action({
            effect: "increase key cost by 3 during {1}'s next turn",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.nextRoundEffect({
                targetController: 'any',
                effect: ability.effects.modifyKeyCost(3)
            })
        });
    }
}

LashOfBrokenDreams.id = 'lash-of-broken-dreams';

module.exports = LashOfBrokenDreams;
