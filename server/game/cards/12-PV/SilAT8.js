import Card from '../../Card.js';

class SilAT8 extends Card {
    // Enhance .
    // After Fight/After Reap: You may ready a non-Robot creature for each of Sil-A-T8's Star Alliance neighbors.
    setupCardAbilities(ability) {
        this.fight({
            reap: true,
            effect: 'ready {1} non-Robot creature{2}',
            effectArgs: (context) => {
                const count = context.source.neighbors.filter((card) =>
                    card.hasHouse('staralliance')
                ).length;
                return [count, count === 1 ? '' : 's'];
            },
            gameAction: ability.actions.sequentialForEach((context) => ({
                num: context.source.neighbors.filter((card) => card.hasHouse('staralliance'))
                    .length,
                action: ability.actions.ready({
                    promptForSelect: {
                        cardType: 'creature',
                        cardCondition: (card) => !card.hasTrait('robot'),
                        message: '{0} uses {1} to ready {2}',
                        messageArgs: (card) => [context.player, context.source, card]
                    }
                })
            }))
        });
    }
}

SilAT8.id = 'sil-a-t8';

export default SilAT8;
