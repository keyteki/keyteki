const Card = require('../../Card.js');

class Initiation extends Card {
    //Play: Make a token creature. If you have fewer than 4 cards in hand, archive Initiation.
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

Initiation.id = 'initiation';

module.exports = Initiation;
