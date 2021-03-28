const Card = require('../../Card.js');

class ImperialRoad extends Card {
    setupCardAbilities(ability) {
        this.omni({
            target: {
                cardType: 'creature',
                location: 'hand',
                controller: 'self',
                cardCondition: (card) => card.hasHouse('saurian'),
                gameAction: ability.actions.playCard()
            },
            then: (preThenContext) => ({
                gameAction: ability.actions.stun({ target: preThenContext.target })
            })
        });
    }
}

ImperialRoad.id = 'imperial-road';

module.exports = ImperialRoad;
