const Card = require('../../Card.js');

class AdultSwim extends Card {
    //Play: Put each creature with power 3 or lower on top of its owner's deck in a random order.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                gameAction: ability.actions.sequential([
                    ability.actions.enrage(),
                    ability.actions.capture((context) => ({
                        amount: 1,
                        player: context.player.opponent
                    }))
                ])
            }
        });
    }
}

AdultSwim.id = 'adult-swim';

module.exports = AdultSwim;
