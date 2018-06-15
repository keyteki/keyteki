const ForcedTriggeredAbility = require('./forcedtriggeredability.js');

class CardForcedReaction extends ForcedTriggeredAbility {
    constructor(game, card, properties) {
        super(game, card, 'forcedreaction', properties);
    }
}

module.exports = CardForcedReaction;
