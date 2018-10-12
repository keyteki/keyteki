const Card = require('../../Card.js');

class DeipnoSpymaster extends Card {
    setupCardAbilities(ability) {
        this.omni({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.use()
            }            
        });
    }
}

DeipnoSpymaster.id = 'deipno-spymaster'; // This is a guess at what the id might be - please check it!!!

module.exports = DeipnoSpymaster;
