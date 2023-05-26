const Card = require('../../Card.js');

class Befuddle extends Card {
    //Play: Choose a house on your opponent's identity card. During their next turn, they cannot play cards of other houses.
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

Befuddle.id = 'befuddle';

module.exports = Befuddle;
