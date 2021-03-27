const Card = require('../../Card.js');

class ExplorationVessel extends Card {
    //Action: Exhaust up to 3 friendly creatures. Draw 1 card for each house represented among these creatures.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'upTo',
                numCards: '3',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.exhaust()
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.draw({
                    amount: new Set(preThenContext.target.map((card) => card.getHouses()).flat())
                        .size
                })
            })
        });
    }
}

ExplorationVessel.id = 'exploration-vessel';

module.exports = ExplorationVessel;

/*

    setupCardAbilities(ability) {
        this.action({
            target: {
                mode: 'upTo',
                numCards: '3',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.exhaust()
            },
            then: (preThenContext) => ({
              gameAction: ability.actions.draw( 
                {
                  amount: new Set( preThenContext.target.map( (card) => card.houses ).flat() ).size
                }
              )
            })
        });

    }

    */
