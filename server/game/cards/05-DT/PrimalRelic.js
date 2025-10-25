const Card = require('../../Card.js');

class PrimalRelic extends Card {
    // Play: Put  4A on Primal Relic from the common supply. Give 3 creatures a +1 power counter.
    // At the start of each player’s turn, if they control creatures with total power 20 or higher, move each A from Primal Relic to that player's pool.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.placeAmber({
                amount: 4
            }),
            then: {
                alwaysTriggers: true,
                target: {
                    numCards: 3,
                    mode: 'exactly',
                    cardType: 'creature',
                    gameAction: ability.actions.addPowerCounter()
                }
            }
        });
        this.reaction({
            when: {
                onTurnStart: () => true
            },
            gameAction: ability.actions.removeAmber({ all: true }),
            condition: (context) =>
                context.game.activePlayer.creaturesInPlay.reduce(
                    (total, c) => total + c.power,
                    0
                ) >= 20,
            then: {
                gameAction: ability.actions.gainAmber((context) => ({
                    amount: context.preThenEvent.amount,
                    target: context.game.activePlayer
                }))
            }
        });
    }
}

PrimalRelic.id = 'primal-relic';

module.exports = PrimalRelic;
