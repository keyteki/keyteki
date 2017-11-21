const BaseAbility = require('../../baseability.js');

class CovertAbility extends BaseAbility {
    isAction() {
        return false;
    }

    isCardAbility() {
        return true;
    }

    isTriggeredAbility() {
        return false;
    }
}

module.exports = CovertAbility;
