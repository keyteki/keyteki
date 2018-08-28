const Card = require('../../Card.js');

class MassAbduction extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'upTo',
                numCards: 3,
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: card => card.hasToken('damage'),
                gameAction: ability.actions.archive()
            }
        });
    }
}

MassAbduction.id = 'mass-abduction'; // This is a guess at what the id might be - please check it!!!

module.exports = MassAbduction;
