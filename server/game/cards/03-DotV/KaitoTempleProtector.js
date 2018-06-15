const DrawCard = require('../../drawcard.js');

class KaitoTempleProtector extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isDefending(),
            match: this,
            effect: ability.effects.cannotBeSentHome(context => context && context.source.controller === this.controller.opponent)
        });
        this.action({
            title: 'Change base skills to match another character\'s',
            condition: context => context.source.isDefending(),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.isParticipating() && card !== context.source
            },
            handler: context => {
                let newMil = context.target.getMilitarySkill();
                let newPol = context.target.getPoliticalSkill();
                this.game.addMessage('{0} uses {1}, targeting {2} and changing {1}\'s base {3} skill to {4} and {5} skill to {6}', context.player, context.source, context.target, 'military', newMil, 'political', newPol);
                context.source.untilEndOfConflict(ability => ({
                    match: context.source,
                    effect: [
                        ability.effects.modifyBaseMilitarySkill(newMil - context.source.baseMilitarySkill),
                        ability.effects.modifyBasePoliticalSkill(newPol - context.source.basePoliticalSkill)
                    ]
                }));
            }
        });
    }
}

KaitoTempleProtector.id = 'kaito-temple-protector'; // This is a guess at what the id might be - please check it!!!

module.exports = KaitoTempleProtector;
