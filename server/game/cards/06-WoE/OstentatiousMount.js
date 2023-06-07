const Card = require('../../Card.js');

class OstentatiousMount extends Card {
    // Play: Move this creature anywhere in its controller's battleline.
    // This creature gains taunt.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.moveOnBattleline((context) => ({
                target: context.source.parent,
                player: context.player
            }))
        });
    }
}

OstentatiousMount.id = 'ostentatious-mount';

module.exports = OstentatiousMount;
