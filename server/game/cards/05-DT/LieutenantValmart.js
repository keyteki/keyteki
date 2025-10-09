const Card = require('../../Card.js');

class LieutenantValmart extends Card {
    // (T) Play/Fight/Reap: If the tide is high, keys cost +3A during your opponent's next turn.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            condition: (context) => context.player.isTideHigh(),
            effect: "increase key cost by 3 during {1}'s next turn",
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.untilEndOfOpponentsNextTurn({
                targetController: 'any',
                effect: ability.effects.modifyKeyCost(3)
            })
        });
    }
}

LieutenantValmart.id = 'lieutenant-valmart';

module.exports = LieutenantValmart;
