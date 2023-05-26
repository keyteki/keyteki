const Card = require('../../Card.js');

class WeakLink extends Card {
    //This creature gains, "While this creature is exhausted, your keys cost +6A icon."
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

WeakLink.id = 'weaklink';

module.exports = WeakLink;
