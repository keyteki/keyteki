const Card = require('../../Card.js');

class DiplomatAgung extends Card {
    //Play/Fight/Reap: For the remainder of your turn, a friendly creature belongs to the house of your choice in addition to its other houses.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            target: {
                mode: 'house'
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.cardLastingEffect(() => ({
                        effect: ability.effects.addHouse(preThenContext.house)
                    }))
                }
            })
        });
    }
}

DiplomatAgung.id = 'diplomat-agung';

module.exports = DiplomatAgung;
