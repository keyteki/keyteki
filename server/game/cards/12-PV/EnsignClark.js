const Card = require('../../Card.js');

class EnsignClark extends Card {
    // Enhance.
    // Fate: Destroy a friendly artifact.
    setupCardAbilities(ability) {
        this.fate({
            target: {
                cardType: 'artifact',
                controller: 'opponent',
                gameAction: ability.actions.destroy()
            }
        });
    }
}

EnsignClark.id = 'ensign-clark';

module.exports = EnsignClark;
