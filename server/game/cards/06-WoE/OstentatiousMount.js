const Card = require('../../Card.js');

class OstentatiousMount extends Card {
    // Play: Move this creature anywhere in its controller's battleline.
    // This creature gains taunt.
    setupCardAbilities(ability) {
        this.play({
            effect: 'move {1} and give it taunt',
            effectArgs: (context) => context.source.parent,
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
