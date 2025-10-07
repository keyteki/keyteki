import Card from '../../Card.js';

class RedSkies extends Card {
    // Play: Move a friendly Skyborn creature to a flank and ready
    // it. If a red key is forged, repeat the preceding effect.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                cardType: 'creature',
                cardCondition: (card) => card.hasHouse('skyborn'),
                gameAction: ability.actions.sequential([
                    ability.actions.moveToFlank(),
                    ability.actions.ready()
                ])
            },
            effect: 'move {1} to a flank and ready it',
            effectArgs: (context) => [context.target],
            then: {
                condition: (context) =>
                    context.player.keys.red ||
                    (context.player.opponent && context.player.opponent.keys.red),
                alwaysTriggers: true,
                target: {
                    controller: 'self',
                    cardType: 'creature',
                    cardCondition: (card) => card.hasHouse('skyborn'),
                    gameAction: ability.actions.sequential([
                        ability.actions.moveToFlank(),
                        ability.actions.ready()
                    ])
                },
                message:
                    '{0} uses {1} to repeat the preceding effect and move {3} to a flank and ready it',
                messageArgs: (context) => [context.target]
            }
        });
    }
}

RedSkies.id = 'red-skies';

export default RedSkies;
