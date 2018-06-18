const StrongholdCard = require('../../strongholdcard.js');

class ShizukaToshi extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow a character',
            condition: () => this.game.isDuringConflict('political'),
            cost: ability.costs.bowSelf(),
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating() && card.politicalSkill <= 2,
                gameAction: ability.actions.bow()
            }
        });
    }
}

ShizukaToshi.id = 'shizuka-toshi';

module.exports = ShizukaToshi;
