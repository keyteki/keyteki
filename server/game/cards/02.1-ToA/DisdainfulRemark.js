const DrawCard = require('../../drawcard.js');

class DisdainfulRemark extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Add Province Strength',
            condition: context => context.player.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('courtier')) &&
                                  context.player.opponent && context.player.opponent.hand.size() > 0,
            effect: 'add {1} to the province strength',
            effectArgs: context => context.player.opponent.hand.size(),
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: this.game.currentConflict.conflictProvince,
                targetLocation: 'province',
                effect: ability.effects.modifyProvinceStrength(context.player.opponent.hand.size())
            }))
        });
    }
}

DisdainfulRemark.id = 'disdainful-remark';

module.exports = DisdainfulRemark;
