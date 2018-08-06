const DrawCard = require('../../drawcard.js');

class MatsuSeventhLegion extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            match: card => card.hasTrait('courtier'),
            targetController: 'opponent',
            effect: ability.effects.cardCannot('declareAsDefender')});
    }
}
MatsuSeventhLegion.id = 'matsu-seventh-legion';

module.exports = MatsuSeventhLegion;
