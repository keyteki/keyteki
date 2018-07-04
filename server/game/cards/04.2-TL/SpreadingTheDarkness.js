const DrawCard = require('../../drawcard.js');

class SpreadingTheDarkness extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character +4/+0',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.payHonor(2),
            target: {
                cardType: 'character',
                controller: 'self',
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.cardLastingEffect(context => ({
                    effect: [
                        ability.effects.modifyMilitarySkill(4),
                        ability.effects.cardCannot('target', abilityContext => (
                            abilityContext.player === context.player.opponent &&
                            context.source.type && context.source.type !== 'ring'
                        ))
                    ]
                }))
            }
        });
    }
}

SpreadingTheDarkness.id = 'spreading-the-darkness'; // This is a guess at what the id might be - please check it!!!

module.exports = SpreadingTheDarkness;
