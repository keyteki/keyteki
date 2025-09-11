const Card = require('../../Card.js');

class PlublioSDecree extends Card {
    // Play: You may exalt up to 3 friendly creatures. For the remainder of the turn, they belong to house Saurian.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                numCards: 3,
                mode: 'upTo',
                gameAction: [
                    ability.actions.exalt(),
                    ability.actions.cardLastingEffect({
                        effect: ability.effects.changeHouse('saurian')
                    })
                ]
            }
        });
    }
}

PlublioSDecree.id = 'plublio-s-decree';

module.exports = PlublioSDecree;
