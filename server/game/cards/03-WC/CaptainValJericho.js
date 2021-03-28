const Card = require('../../Card.js');

class CaptainValJericho extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isInCenter(),
            targetController: 'current',
            effect: ability.effects.canPlayNonHouse((card, context) => context.player.activeHouse)
        });
    }
}

CaptainValJericho.id = 'captain-val-jericho';

module.exports = CaptainValJericho;
