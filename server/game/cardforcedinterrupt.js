const ForcedTriggeredAbility = require('./forcedtriggeredability.js');

class CardForcedInterrupt extends ForcedTriggeredAbility {
    constructor(game, card, properties) {
        super(game, card, 'forcedinterrupt', properties);
    }
}

module.exports = CardForcedInterrupt;
