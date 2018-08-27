const Card = require('../../Card.js');

class ControlTheWeak extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent,
            target: {
                mode: 'house',
                houses: context => context.player.opponent.houses
            },
            gameAction: ability.actions.lastingEffect(context => ({
                effect: ability.effect.restrictHouseChoice([context.house])
            }))
        });
    }
}

ControlTheWeak.id = 'control-the-weak'; // This is a guess at what the id might be - please check it!!!

module.exports = ControlTheWeak;
