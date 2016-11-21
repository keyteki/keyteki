const DrawCard = require('../../../drawcard.js');

class TheIronThrone extends DrawCard {
    getReserve() {
        return 1;
    }

    modifyDominance(player, strength) {
        if(this.inPlay && this.owner === player) {
            return strength + 8;
        }

        return strength;
    }
}

TheIronThrone.code = '01038';

module.exports = TheIronThrone;
