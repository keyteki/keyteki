const Card = require('../../Card.js');

class CaptainValJericho extends Card {
    // While Captain Val Jericho is in the center of your battleline, you may play 1 card that is not of the active house during your turn.
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
