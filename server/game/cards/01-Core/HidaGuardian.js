const DrawCard = require('../../drawcard.js');

class HidaGuardian extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character a bonus for each holding',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.isParticipating() && card !== context.source,
                gameAction: ability.actions.cardLastingEffect(context => ({
                    effect: ability.effects.modifyBothSkills(2 * context.player.getNumberOfHoldingsInPlay())
                }))
            },
            effect: 'give {0} +{1}{2}/+{1}{3}',
            effectArgs: context => [2 * context.player.getNumberOfHoldingsInPlay(), 'military', 'political']
        });
    }
}

HidaGuardian.id = 'hida-guardian';

module.exports = HidaGuardian;
