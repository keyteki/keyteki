const Card = require('../../Card.js');

class Bracchanalia extends Card {
    // Play: Put 4A on Bracchanalia from the common supply. A friendly creature captures 1A.
    // At the start of each player’s turn, if that player controls 4 or more creatures with A on them, move each A from Bracchanalia to that player’s pool.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                gameAction: ability.actions.capture()
            },
            gameAction: ability.actions.placeAmber({
                amount: 4,
                target: this
            })
        });

        this.reaction({
            when: {
                onTurnStart: (_, context) =>
                    context.game.activePlayer &&
                    context.game.activePlayer.creaturesInPlay.filter((card) => card.amber).length >=
                        4
            },
            gameAction: ability.actions.removeAmber({ all: true }),
            then: {
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: context.preThenEvent.amount,
                    target: context.game.activePlayer
                }))
            }
        });
    }
}

Bracchanalia.id = 'bracchanalia';

module.exports = Bracchanalia;
