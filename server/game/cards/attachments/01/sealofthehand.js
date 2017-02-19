const DrawCard = require('../../../drawcard.js');

class SealOfTheHand extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand attached character',
            condition: () => this.parent.kneeled,
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.controller.standCard(this.parent);
                this.game.addMessage('{0} kneels {1} to stand {2}', this.controller, this, this.parent);
            }
        });
    }

    canAttach(player, card) {
        if(!card.hasTrait('Lady') && !card.hasTrait('Lord')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

SealOfTheHand.code = '01032';

module.exports = SealOfTheHand;
