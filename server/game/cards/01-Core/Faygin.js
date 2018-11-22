const Card = require('../../Card.js');

class Faygin extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                location: ['play area', 'discard'],
                controller: 'self',
                cardCondition: card => card.name === 'Urchin',
                gameAction: ability.actions.returnToHand(context => ({
                    location: context.target.location
                }))
            }
        });
    }
}

Faygin.id = 'faygin'; // This is a guess at what the id might be - please check it!!!

module.exports = Faygin;
