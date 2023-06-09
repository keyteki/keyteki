const Card = require('../../Card.js');

class NarpsBrew extends Card {
    // Play: Give a creature two +1 power counters.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.addPowerCounter({
                    amount: 2
                })
            }
        });
    }
}

NarpsBrew.id = 'narp-s-brew';

module.exports = NarpsBrew;
