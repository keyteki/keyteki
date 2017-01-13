const DrawCard = require('../../../drawcard.js');

class ShieldOfLannisport extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: () => this.noOtherLordsOrLadies(),
            effect: [
                ability.effects.modifyStrength(2),
                ability.effects.addKeyword('Renown')
            ]
        });
    }

    noOtherLordsOrLadies() {
        return !this.controller.cardsInPlay.any(card => (
            card !== this.parent &&
            (card.hasTrait('Lord') || card.hasTrait('Lady')) &&
            card.getCost() < 4
        ));
    }

    getIncome() {
        return 1;
    }
}

ShieldOfLannisport.code = '05020';

module.exports = ShieldOfLannisport;
