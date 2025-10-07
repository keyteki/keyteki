import Card from '../../Card.js';

class MartianRevolution extends Card {
    // Play: Destroy each friendly creature. For each creature
    // destroyed this way, make a token creature.
    setupCardAbilities(ability) {
        this.play({
            effect:
                'destroy each friendly creature and make a token creature for each creature destroyed this way',
            gameAction: ability.actions.destroy((context) => ({
                target: context.player.creaturesInPlay
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.makeTokenCreature((context) => ({
                    amount: context.preThenEvents.filter((event) => !event.cancelled).length
                }))
            }
        });
    }
}

MartianRevolution.id = 'martian-revolution';

export default MartianRevolution;
