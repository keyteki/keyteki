const Card = require('../../Card.js');

class OstentatiousMount extends Card {
    // Play: Move this creature anywhere in its controller's battleline.
    // This creature gains taunt.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.moveOnBattleline((context) => ({
                target: context.source.parent,
                player: context.source.parent.controller
            }))
        });

        this.whileAttached({
            effect: ability.effects.addKeyword({ taunt: 1 })
        });
    }
}

OstentatiousMount.id = 'ostentatious-mount';

module.exports = OstentatiousMount;
