const Card = require('../../Card.js');

class TouristTrap extends Card {
    //  Play: Make a token creature.
    //
    // Action: Choose a friendly token creature and an enemy
    // creature. If you do, swap control of those creatures.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });

        this.action({
            condition: (context) =>
                context.player.creaturesInPlay.length > 0 &&
                context.player.opponent.creaturesInPlay.length > 0,
            targets: {
                first: {
                    cardType: 'creature',
                    controller: 'self',
                    cardCondition: (card) => card.isToken()
                },
                second: {
                    dependsOn: 'first',
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.swap((context) => ({
                        origin: context.targets.first
                    }))
                }
            }
        });
    }
}

TouristTrap.id = 'tourist-trap';

module.exports = TouristTrap;
