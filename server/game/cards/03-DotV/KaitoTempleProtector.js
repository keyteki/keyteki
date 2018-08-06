const DrawCard = require('../../drawcard.js');

class KaitoTempleProtector extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isDefending(),
            match: this,
            effect: ability.effects.cardCannot({
                cannot: 'sendHome',
                restricts: 'opponentsCardEffects',
                source: this
            })
        });
        this.action({
            title: 'Change base skills to match another character\'s',
            condition: context => context.source.isDefending(),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.isParticipating() && card !== context.source,
                gameAction: ability.actions.cardLastingEffect(context => {
                    let effects = [];
                    if(context.target.hasDash('military')) {
                        effects.push(ability.effects.setDash('military'));
                    } else {
                        effects.push(ability.effects.setBaseMilitarySkill(context.target.militarySkill));
                    }
                    if(context.target.hasDash('political')) {
                        effects.push(ability.effects.setDash('political'));
                    } else {
                        effects.push(ability.effects.setBasePoliticalSkill(context.target.politicalSkill));
                    }
                    return {
                        target: context.source,
                        effect: effects
                    };
                })
            },
            effect: 'change his base skills to equal {0}\'s current skills'
        });
    }
}

KaitoTempleProtector.id = 'kaito-temple-protector';

module.exports = KaitoTempleProtector;
