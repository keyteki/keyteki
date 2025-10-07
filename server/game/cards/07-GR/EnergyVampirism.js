import Card from '../../Card.js';

class EnergyVampirism extends Card {
    // Play: A creature captures 1 A from its own side. For each A on
    // that creature, deal 1 D to a creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'any',
                gameAction: ability.actions.sequential([
                    ability.actions.capture((context) => ({
                        amount: 1,
                        player: context.target.controller
                    })),
                    ability.actions.allocateDamage((context) => ({
                        numSteps: context.target.amber || 0
                    }))
                ])
            },
            effect:
                'capture 1 amber onto {0} from its own side and then deal 1 D for each amber on {0} to a creature'
        });
    }
}

EnergyVampirism.id = 'energy-vampirism';

export default EnergyVampirism;
