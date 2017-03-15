const DrawCard = require('../../../drawcard.js');

class TheBoyKing extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addTrait('King')
        });
        this.reaction({
            when: {
                onCharacterKilled: (event, player, card) => card.getCost() <= 3
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.parent.modifyPower(1);
                this.game.addMessage('{0} kneels {1} to have {2} gain 1 power', this.controller, this, this.parent);
            }
        });
    }

    canAttach(player, card) {
        if(!card.hasTrait('Lord') || card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

TheBoyKing.code = '04030';

module.exports = TheBoyKing;
