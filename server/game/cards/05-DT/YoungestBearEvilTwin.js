const Card = require('../../Card.js');

class YoungestBearEvilTwin extends Card {
    //Reap: Use a neighboring creature to fight.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.fight()
            }
        });
    }
}

YoungestBearEvilTwin.id = 'youngest-bear-evil-twin';

module.exports = YoungestBearEvilTwin;
