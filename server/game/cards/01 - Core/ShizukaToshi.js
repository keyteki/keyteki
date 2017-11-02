const StrongholdCard = require('../../strongholdcard.js');

class ShizukaToshi extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow a character',
            cost: ability.costs.bowSelf(),
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'political',
            target: {
                cardType: 'character',
                gameAction: 'bow',
                cardCondition: card => {
                    return (card.isParticipating() &&
                            card.getPoliticalSkill() < 3);
                }
            },
            handler: context => {
                this.game.addMessage('{0} bows {1} to bow {2}', this.controller, this, context.target);
                this.controller.bowCard(context.target, context.source);
            }
        });
    }
}

ShizukaToshi.id = 'shizuka-toshi';

module.exports = ShizukaToshi;
