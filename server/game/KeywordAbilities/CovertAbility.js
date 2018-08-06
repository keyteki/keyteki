const BaseAbility = require('../baseability.js');

class CovertAbility extends BaseAbility {
    constructor() {
        super({});
        this.title = 'covert';
    }

    isCardAbility() {
        return true;
    }
}

module.exports = CovertAbility;
