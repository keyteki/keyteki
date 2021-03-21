const Card = require('../../Card.js');

class PrimalRelic extends Card {
    //Play: Put 4A from the common supply onto Primal Relic (?). Put a +1 power counter on 3 creatures.
    //At the start of each turn, if a player controls creatures with combined power greater than or equal to 20, move all A on Primal Relic to that player's pool.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.placeAmber({
                amount: 4,
                target: this
            }),
            then: {
                alwaysTriggers: true,
                target: {
                    numCards: '3',
                    cardType: 'creature',
                    gameAction: ability.actions.addPowerCounter({ amount: 1 })
                }
            }
        });
        this.reaction({
            when: {
                onBeginRound: () => true
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
