import Card from '../../Card.js';

class RenderGuilt extends Card {
    // Play: A friendly creature captures 1A. For each A on that creature, deal 1D to a creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.capture(),
                    ability.actions.allocateDamage((context) => ({
                        numSteps: context.target.amber || 0
                    }))
                ])
            },
            effect:
                'capture 1 amber onto {0} from the opponent and then deal 1 damage for each amber on {0} to a creature'
        });
    }
}

RenderGuilt.id = 'render-guilt';

export default RenderGuilt;
