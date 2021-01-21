const Card = require('../../Card.js');

class LieutenantValmart extends Card {
    //Play/Fight/Reap: If the tide is high, keys cost +3A during your opponent’s next turn.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.lastingEffect({
                targetController: 'any',
                effect: ability.effects.modifyKeyCost(3)
            })
        });
    }
}

LieutenantValmart.id = 'lieutenant-valmart';

module.exports = LieutenantValmart;
