const Card = require('../../Card.js');

class EnsignElSamra extends Card {
    // Enhance RRR.
    // Action: Reveal a card from your hand. Resolve its bonus icons as if you had played it.
    setupCardAbilities(ability) {
        this.action({
            target: {
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.resolveBonusIcons()
            },
            effect: 'reveal {1} from their hand and resolve its bonus icons',
            effectArgs: (context) => [context.target]
        });
    }
}

EnsignElSamra.id = 'ensign-el-samra';

module.exports = EnsignElSamra;
