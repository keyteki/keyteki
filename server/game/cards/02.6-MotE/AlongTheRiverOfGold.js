const ProvinceCard = require('../../provincecard.js');

class AlongTheRiverOfGold extends ProvinceCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'switch a character\'s base skills',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictProvince.getElement() === 'water',
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating() && !card.hasDash(),
                gameAction: ability.actions.cardLastingEffect(context => ({
                    effect: [
                        ability.effects.modifyBaseMilitarySkill(context.target.basePoliticalSkill - context.target.baseMilitarySkill),
                        ability.effects.modifyBasePoliticalSkill(context.target.baseMilitarySkill - context.target.basePoliticalSkill)
                    ]
                }))
            },
            effect: 'switch {0}\'s military and political skill'
        });
    }
}

AlongTheRiverOfGold.id = 'along-the-river-of-gold';

module.exports = AlongTheRiverOfGold;
