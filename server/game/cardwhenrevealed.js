const ForcedTriggeredAbility = require('./forcedtriggeredability.js');

class CardWhenRevealed extends ForcedTriggeredAbility {
    constructor(game, card, properties) {
        super(game, card, 'whenrevealed', properties);
    }

    // Technically when reveal IS a card ability, but until something is implemented that can actually make use of it
    // It's less annoying not to prompt to cancel it
    isCardAbility() {
        return false;
    }
}

module.exports = CardWhenRevealed;
