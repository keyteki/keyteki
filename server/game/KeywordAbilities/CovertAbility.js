const BaseAbility = require('../baseability.js');

class CovertAbility extends BaseAbility {
    constructor() {
        super({});
    }
    
    isCardAbility() {
        return true;
    }
}

module.exports = CovertAbility;
