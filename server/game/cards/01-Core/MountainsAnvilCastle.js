const StrongholdCard = require('../../strongholdcard.js');

class MountainsAnvilCastle extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Give a character with attachments bonus skill',
            cost: ability.costs.bowSelf(),
            condition: () => this.game.currentConflict,
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating() && card.attachments.size() > 0,
                gameAction: ability.actions.cardLastingEffect(context => ({
                    effect: ability.effects.modifyBothSkills(Math.min(context.target.attachments.size(), 2))
                }))
            },
            effect: 'give {0} +{1}{2}/{1}{3}',
            effectArgs: context => [Math.min(context.target.attachments.size(), 2), 'military', 'political']
        });
    }
}

MountainsAnvilCastle.id = 'mountain-s-anvil-castle';

module.exports = MountainsAnvilCastle;
