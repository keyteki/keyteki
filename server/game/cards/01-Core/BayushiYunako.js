const DrawCard = require('../../drawcard.js');

class BayushiYunako extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Switch a character\'s M and P skill',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: 'character',
                cardCondition: card => !card.hasDash(),
                gameAction: ability.actions.cardLastingEffect(context => {
                    let diff = context.target.baseMilitarySkill - context.target.basePoliticalSkill;
                    return {
                        effect: [
                            ability.effects.modifyBaseMilitarySkill(-diff),
                            ability.effects.modifyBasePoliticalSkill(diff)    
                        ]
                    };
                })
            },
            effect: 'switch {0}\'s military and political skill'
        });
    }
}

BayushiYunako.id = 'bayushi-yunako';

module.exports = BayushiYunako;
