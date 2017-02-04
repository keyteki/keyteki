const DrawCard = require('../../../drawcard.js');

class AlannysGreyjoy extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.controller.firstPlayer,
            match: (card) => card === card.controller.activePlot,
            targetController: 'opponent',
            effect: ability.effects.modifyReserve(-1)
        });
    }
}

AlannysGreyjoy.code = '01066';

module.exports = AlannysGreyjoy;
