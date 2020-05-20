const Card = require('../../Card.js');

class ControlTheWeak extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            target: {
                mode: 'house',
                houses: (context) => context.player.opponent.houses
            },
            effect: 'force {1} to choose {2} as their active house on their next turn',
            effectArgs: (context) => [context.player.opponent, context.house],
            gameAction: ability.actions.lastingEffect((context) => ({
                effect: ability.effects.restrictHouseChoice([context.house])
            }))
        });
    }
}

ControlTheWeak.id = 'control-the-weak';

module.exports = ControlTheWeak;
