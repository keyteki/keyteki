const DrawCard = require('../../drawcard.js');

class ApprenticeEarthcaller extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Set skill values to printed values',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: 'character',
                cardCondition: card => card.isAttacking() && card.attachments.size() === 0,
                gameAction: ability.actions.cardLastingEffect(context => ({
                    effect: [
                        ability.effects.setMilitarySkill(context.target.printedMilitarySkill),
                        ability.effects.setPoliticalSkill(context.target.printedPoliticalSkill)
                    ]
                }))
            },
            effect: 'set {0}\'s skill values to their printed values until the end of the conflict'
        });
    }
}

ApprenticeEarthcaller.id = 'apprentice-earthcaller';

module.exports = ApprenticeEarthcaller;
