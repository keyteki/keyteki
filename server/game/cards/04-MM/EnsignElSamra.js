const Card = require('../../Card.js');

class EnsignElSamra extends Card {
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
