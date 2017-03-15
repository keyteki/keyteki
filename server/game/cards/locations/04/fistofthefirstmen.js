const DrawCard = require('../../../drawcard.js');

class FistOfTheFirstMen extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => {
                var opponent = this.game.getOtherPlayer(this.controller);

                return !opponent || this.controller.getTotalReserve() > opponent.getTotalReserve();
            },
            match: (card) => card.getType() === 'character' && card.hasTrait('Ranger'),
            effect: [
                ability.effects.modifyStrength(1),
                ability.effects.cannotBeBypassedByStealth()
            ]
        });
    }
}

FistOfTheFirstMen.code = '04106';

module.exports = FistOfTheFirstMen;
