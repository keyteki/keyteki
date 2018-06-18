const DrawCard = require('../../drawcard.js');

class AgainstTheWaves extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow or ready a shugenja',
            target: {
                cardType: 'character',
                cardCondition: card => card.hasTrait('shugenja'),
                gameAction: [ability.actions.bow(), ability.actions.ready()]
            }
        });
    }
}

AgainstTheWaves.id = 'against-the-waves';

module.exports = AgainstTheWaves;
