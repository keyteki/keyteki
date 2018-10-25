const Card = require('../../Card.js');

class Mimicry extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'action',
                controller: 'opponent',
                location: 'discard',
                gameAction: ability.actions.playCard()
            }
        });
    }
}

Mimicry.id = 'mimicry'; // This is a guess at what the id might be - please check it!!!

module.exports = Mimicry;
