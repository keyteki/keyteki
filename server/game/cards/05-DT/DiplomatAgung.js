const Card = require('../../Card.js');

class DiplomatAgung extends Card {
    //Play/Fight/Reap: For the remainder of your turn, a friendly creature belongs to the house of your choice in addition to its other houses.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            reap: true,
            // tried to use "targets:"" here, but targets[targetName].house does not get assigned
            target: {
                mode: 'house'
            },
            effect: 'selected {1} for creature to belong to',
            effectArgs: (context) => [context.house],
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
