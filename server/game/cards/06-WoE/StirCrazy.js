const Card = require('../../Card.js');

class StirCrazy extends Card {
    //Play: Each ready creature captures 1A from its opponent.
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

StirCrazy.id = 'stir-crazy';

module.exports = StirCrazy;
