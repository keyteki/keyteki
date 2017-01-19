const DrawCard = require('../../../drawcard.js');

class TheIronThrone extends DrawCard {
    setupCardAbilities() {
        this.plotModifiers({
            reserve: 1
        });
    }

    modifyDominance(player, strength) {
        if(this.controller === player && !this.isBlank()) {
            return strength + 8;
        }

        return strength;
    }
}

TheIronThrone.code = '01038';

module.exports = TheIronThrone;
