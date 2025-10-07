import Card from '../../Card.js';

class TransmutingLift extends Card {
    // This creature gains, “After Reap: You may move this creature
    // anywhere in its controller’s battleline.”
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.moveOnBattleline((context) => ({
                    target: context.source,
                    player: context.source.controller
                })),
                effect: 'move {1} anywhere in their battleline',
                effectArgs: (context) => [context.source]
            })
        });
    }
}

TransmutingLift.id = 'transmuting-lift';

export default TransmutingLift;
