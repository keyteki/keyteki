const Card = require('../../Card.js');

class TautauVapors extends Card {
    // Play: Draw 2 cards. Archive a card.
    setupCardAbilities(ability) {
        this.play({
            effect: 'draw 2 cards and archive 1 card',
            gameAction: ability.actions.draw({ amount: 2 }),
            then: {
                target: {
                    controller: 'self',
                    location: 'hand',
                    gameAction: ability.actions.archive()
                }
            }
        });
    }
}

TautauVapors.id = 'tautau-vapors';

module.exports = TautauVapors;
