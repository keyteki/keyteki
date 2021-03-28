const Card = require('../../Card.js');

class BindingIrons extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.gainChains((context) => ({
                target: context.player.opponent,
                amount: 3
            })),
            effect: 'give {1} 3 chains',
            effectArgs: (context) => context.player.opponent
        });
    }
}

BindingIrons.id = 'binding-irons';

module.exports = BindingIrons;
