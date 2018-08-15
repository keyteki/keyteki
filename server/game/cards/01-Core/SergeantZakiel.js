const Card = require('../../Card.js');

class SergeantZakiel extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: //TODO: Sequential action?
            }
        })
    }
}

SergeantZakiel.id = 'sergeant-zakiel'; // This is a guess at what the id might be - please check it!!!

module.exports = SergeantZakiel;
