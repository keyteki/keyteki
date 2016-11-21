const DrawCard = require('../../../drawcard.js');
 
// TODO: +1 draw or +1 gold when first player.
class CerseisWheelhouse extends DrawCard {
    getInitiative() {
        return -1;
    }
}

CerseisWheelhouse.code = '02010';

module.exports = CerseisWheelhouse;
