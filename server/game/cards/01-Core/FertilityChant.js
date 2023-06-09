const Card = require('../../Card.js');

class FertilityChant extends Card {
    // Play: Your opponent gains 2<A>.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect: 'cause {1} to gain 2 amber',
            effectArgs: (context) => context.player.opponent,
            gameAction: ability.actions.gainAmber((context) => ({
                amount: 2,
                target: context.player.opponent
            }))
        });
    }
}

FertilityChant.id = 'fertility-chant';

module.exports = FertilityChant;
