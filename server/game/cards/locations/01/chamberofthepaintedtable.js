const DrawCard = require('../../../drawcard.js');

class ChamberOfThePaintedTable extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: (event, winner) => this.controller === winner
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);
                if(!otherPlayer || otherPlayer.faction.power === 0) {
                    return false;
                }

                this.game.addMessage('{0} kneels {1} to move 1 power from {2}\'s faction card to their own',
                                     this.controller, this, otherPlayer);
                this.game.transferPower(this.controller, otherPlayer, 1);
            }
        });
    }
}

ChamberOfThePaintedTable.code = '01060';

module.exports = ChamberOfThePaintedTable;
