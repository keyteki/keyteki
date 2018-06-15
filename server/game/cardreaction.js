const PromptedTriggeredAbility = require('./promptedtriggeredability.js');

class CardReaction extends PromptedTriggeredAbility {
    constructor(game, card, properties) {
        super(game, card, 'reaction', properties);
    }
}

module.exports = CardReaction;
