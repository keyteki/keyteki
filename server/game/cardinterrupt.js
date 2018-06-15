const PromptedTriggeredAbility = require('./promptedtriggeredability.js');

class CardInterrupt extends PromptedTriggeredAbility {
    constructor(game, card, properties) {
        super(game, card, properties.canCancel ? 'cancelinterrupt' : 'interrupt', properties);
    }
}

module.exports = CardInterrupt;
