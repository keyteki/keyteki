const Card = require('../../Card.js');

class PullUpStakes extends Card {
    //Play: Shuffle 2 friendly creatures into their owners' decks. Return 4 enemy creatures to their owners' hands.
    setupCardAbilities(ability) {
        this.play({
            target: {
                numCards: 2,
                mode: 'exactly',
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.returnToDeck()
            },
            then: {
                alwaysTriggers: true,
                target: {
                    numCards: 4,
                    mode: 'exactly',
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.returnToHand()
                }
            }
        });
    }
}

PullUpStakes.id = 'pull-up-stakes';

module.exports = PullUpStakes;
