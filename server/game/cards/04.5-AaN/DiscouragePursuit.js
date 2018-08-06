const DrawCard = require('../../drawcard.js');

class DiscouragePursuit extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give -4 military to a participating character',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.dishonor(card => card.hasTrait('shinobi')),
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect(() => ({
                    effect: ability.effects.modifyMilitarySkill(-4)
                }))
            },
            effect: 'reduce {0}\'s military skill by 4'
        });
    }
}

DiscouragePursuit.id = 'discourage-pursuit';

module.exports = DiscouragePursuit;
