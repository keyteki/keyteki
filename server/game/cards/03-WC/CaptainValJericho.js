const Card = require('../../Card.js');

class CaptainValJericho extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isInCenter(),
            targetController: 'current',
            effect: ability.effects.canPlayNonHouse((card, context) => context.player.activeHouse)
        });
    }
}

CaptainValJericho.id = 'captain-val-jericho';

module.exports = CaptainValJericho;
