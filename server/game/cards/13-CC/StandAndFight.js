const Card = require('../../Card.js');

class StandAndFight extends Card {
    // Play: Exalt a friendly creature and an enemy creature. Ready and fight with the friendly creature exalted in this way.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                friendly: {
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    controller: 'self',
                    gameAction: ability.actions.exalt()
                },
                enemy: {
                    mode: 'exactly',
                    numCards: 1,
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.exalt()
                }
            },
            then: (preThenContext) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.sequential([
                    ability.actions.ready({
                        target: preThenContext.targets.friendly
                    }),
                    ability.actions.fight({
                        target: preThenContext.targets.friendly
                    })
                ])
            })
        });
    }
}

StandAndFight.id = 'stand-and-fight';

module.exports = StandAndFight;
