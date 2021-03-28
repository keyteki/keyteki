const Card = require('../../Card.js');

class LashOfBrokenDreams extends Card {
    setupCardAbilities(ability) {
        this.action({
            effect: "increase {1}'s key cost by 3 until the end of their next turn",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost(3)
            })
        });
    }
}

LashOfBrokenDreams.id = 'lash-of-broken-dreams';

module.exports = LashOfBrokenDreams;
