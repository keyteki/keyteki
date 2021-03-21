const Card = require('../../Card.js');

class AmberfinSharkEvilTwin extends Card {
    //At the end of your turn, each player loses 1A. For each A lost this way, give $this a +1 power counter.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) => context.player === this.game.activePlayer
            },

            gameAction: ability.actions.sequential([
                ability.actions.loseAmber((context) => ({
                    amount: 1,
                    target: context.player
                })),
                ability.actions.loseAmber((context) => ({
                    amount: 1,
                    target: context.player.opponent
                }))
            ]),

            then: {
                gameAction: ability.actions.addPowerCounter((context) => ({
                    // works but is wrong ammount:
                    //amount:1
                    // amount: context.preThenEvents.filter( (event) => event.name === 'onModifyAmber' ).reduce((total, event) => total + event.amount, 0),
                    //amount: context.preThenEvents.find( (event) => event.name === 'onModifyAmber' ).length
                    amount: context.preThenEvents.filter((event) => event.name === 'onModifyAmber')
                        .length
                }))
            }
        });

        /*


          condition: (context) => (context.preThenEvents && context.preThenEvents.find( (event) => event.name === 'onModifyAmber' ).length > 0),
          gameAction: ability.actions.addPowerCounter( (context) => ({
            amount: context.preThenEvents ? 0 : context.preThenEvents.find( (event) => event.name === 'onModifyAmber' ).reduce((total, event) => total + event.amount, 0),
          }))

        this.reaction({
            when: {
                onRoundEnded: (context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.sequential([
                ability.actions.loseAmber((context) => ({
                    amount: 1,
                    target: context.player
                })),
                ability.actions.loseAmber((context) => ({
                  amount: 1,
                  target: context.player.opponent
              })),
            ]),
            then: (preThenContext) => ({
              condition: preThenContext.preThenEvents && preThenContext.preThenEvents.find( (event) => event.name === 'onModifyAmber' ).length > 0,
              gameAction: ability.actions.addPowerCounter({
                amount: preThenContext.preThenEvents.find( (event) => event.name === 'onModifyAmber' ).reduce((total, event) => total + event.amount, 0),
              })
            })

                    });

*/
    }
}

AmberfinSharkEvilTwin.id = 'æmberfin-shark-evil-twin';

module.exports = AmberfinSharkEvilTwin;
