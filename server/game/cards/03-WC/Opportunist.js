const Card = require('../../Card.js');

class Opportunist extends Card {
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
