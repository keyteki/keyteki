const TokenCard = require('../../TokenCard.js');

class Scholar extends TokenCard {
    //After Reap: Draw 1 card.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.draw()
        });
    }
}

Scholar.id = 'scholar';

module.exports = Scholar;
