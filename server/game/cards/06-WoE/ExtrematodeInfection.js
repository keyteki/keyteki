const Card = require('../../Card.js');

class ExtrematodeInfection extends Card {
    //Play: Put 3 hatch counters on Extrematode Infection.
    // At the start of your turn, remove 1 hatch counter from Extrematode Infection.
    // Then if it has no hatch counters, destroy this creature and make 3 token creatures.
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

ExtrematodeInfection.id = 'extrematode-infection';

module.exports = ExtrematodeInfection;
