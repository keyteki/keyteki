const Card = require('../../Card.js');

class Soleft extends Card {
    //Destroyed: Destroy the creature on your opponent's left flank.
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

Soleft.id = 'soleft';

module.exports = Soleft;
