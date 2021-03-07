const Card = require('../../Card.js');

class CROfficerHawkinsEvilTwin extends Card {
    //Deploy. (This creature can enter play anywhere in your battleline.)
    //Play: Your opponent loses 1A for each of $this’s non-Star Alliance neighbors.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        //Keywords: deploy
        this.play({
            gameAction: ability.actions.loseAmber((context) => ({
                amount:
                    1 *
                    context.game.creaturesInPlay.filter(
                        (card) =>
                            context.source.neighbors.includes(card) &&
                            !card.hasHouse('staralliance')
                    ).length
            }))
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

CROfficerHawkinsEvilTwin.id = 'cr-officer-hawkins-evil-twin';

module.exports = CROfficerHawkinsEvilTwin;
