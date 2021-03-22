const Card = require('../../Card.js');

class AmberfinSharkEvilTwin extends Card {
    //At the end of your turn, each player loses 1A. For each A lost this way, give $this a +1 power counter.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onRoundEnded: (event, context) => context.player === this.game.activePlayer
            },

            gameAction: [
                ability.actions.loseAmber((context) => ({
                    amount: 1,
                    target: context.player
                })),
                ability.actions.loseAmber((context) => ({
                    amount: 1,
                    target: context.player.opponent
                }))
            ],

            then: {
                gameAction: ability.actions.addPowerCounter((context) => {
                    //console.log(context.preThenEvents);

                    return {
                        amount: context.preThenEvents
                            .filter((event) => event.name === 'onModifyAmber')
                            .reduce((total, event) => total + event.amount, 0)
                        //amount: context.preThenEvents.find( (event) => event.name === 'onModifyAmber' ).length
                        //amount: context.preThenEvents.filter((event) => event.name === 'onModifyAmber').length
                    };
                })
            }
        });
    }
}

AmberfinSharkEvilTwin.id = 'æmberfin-shark-evil-twin';

module.exports = AmberfinSharkEvilTwin;
