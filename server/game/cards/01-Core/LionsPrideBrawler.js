const DrawCard = require('../../drawcard.js');

class LionsPrideBrawler extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow a character',
            condition: context => context.source.isAttacking(),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.getMilitarySkill() <= context.source.getMilitarySkill(),
                gameAction: ability.actions.bow()
            }
        });
    }
}

LionsPrideBrawler.id = 'lion-s-pride-brawler';

module.exports = LionsPrideBrawler;
