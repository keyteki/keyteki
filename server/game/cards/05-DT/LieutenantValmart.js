const Card = require('../../Card.js');

class LieutenantValmart extends Card {
    // (T) Play/Fight/Reap: If the tide is high, keys cost +3A during your opponent's next turn.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.lastingEffect({
                targetController: 'opponent',
                effect: ability.effects.modifyKeyCost(3)
            })
        });
    }
}

LieutenantValmart.id = 'lieutenant-valmart';

module.exports = LieutenantValmart;
