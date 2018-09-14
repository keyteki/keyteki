const Card = require('../../Card.js');

class NepentheSeed extends Card {
    setupCardAbilities(ability) {
        this.omni({
            target: {
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.returnToHand({ location: 'discard' })
            }
        });
    }
}

NepentheSeed.id = 'nepenthe-seed'; // This is a guess at what the id might be - please check it!!!

module.exports = NepentheSeed;
