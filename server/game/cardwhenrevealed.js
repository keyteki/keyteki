const ForcedTriggeredAbility = require('./forcedtriggeredability.js');

class CardWhenRevealed extends ForcedTriggeredAbility {
    constructor(game, card, properties) {
        super(game, card, 'whenrevealed', properties);
    }
}

module.exports = CardWhenRevealed;
