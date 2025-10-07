import Card from '../../Card.js';

class NifflePaw extends Card {
    // This creature gains, After Reap: Destroy this creature and attach Niffle Paw to another creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onReap: (event, context) => event.card === context.source.parent
            },
            gameAction: ability.actions.destroy((context) => ({ target: context.source.parent })),
            then: (preThenContext) => ({
                alwaysTriggers: true,
                message: '{0} uses {3} to move {1} to {2}',
                messageArgs: preThenContext.event.card,
                target: {
                    numCards: 1,
                    cardType: ['creature'],
                    cardCondition: (card) => card.location === 'play area',
                    gameAction: ability.actions.attach((context) => ({
                        upgrade: context.source
                    }))
                }
            })
        });
    }
}

NifflePaw.id = 'niffle-paw';

export default NifflePaw;
