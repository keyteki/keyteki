const Card = require('../../Card.js');

class ImperialRoad extends Card {
    setupCardAbilities(ability) {
        this.omni({
            target: {
                cardType: 'creature',
                location: 'hand',
                controller: 'self',
                cardCondition: card => card.hasHouse('saurian'),
                gameAction: ability.actions.sequential([
                    ability.actions.playCard(),
                    ability.actions.stun()
                ])
            }
        });
    }
}

ImperialRoad.id = 'imperial-road';

module.exports = ImperialRoad;
