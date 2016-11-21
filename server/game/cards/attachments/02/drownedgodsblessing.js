const DrawCard = require('../../../drawcard.js');
 
class DrownedGodsBlessing extends DrawCard {
    getInitiative() {
        return 1;
    }
}

DrownedGodsBlessing.code = '02112';

module.exports = DrownedGodsBlessing;
