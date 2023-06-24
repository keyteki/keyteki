const Card = require('../../Card.js');

class Opportunist extends Card {
    // This creature gains elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // Play: This creature captures 1A from its opponent.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.capture((context) => ({
                target: context.source.parent,
                player: context.source.parent.controller.opponent
            }))
        });

        this.whileAttached({
            effect: ability.effects.addKeyword({ elusive: 1 })
        });
    }
}

Opportunist.id = 'opportunist';

module.exports = Opportunist;
