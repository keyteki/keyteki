const Card = require('../../Card.js');

class GegrrokuuSapper extends Card {
    // Play/After Fight: Take control of an enemy artifact. Give your
    // opponent control of Gegrrŏkŭŭ Sapper.
    //
    // Scrap: Destroy a friendly artifact. If you do, destroy an enemy artifact.
    setupCardAbilities(ability) {
        this.play({
            fight: true,
            target: {
                cardType: 'artifact',
                controller: 'opponent',
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    effect: ability.effects.takeControl(context.player)
                }))
            },
            effect: 'take control of {0} and give control of {1}',
            effectArgs: (context) => [context.source],
            then: {
                alwaysTriggers: true,
                condition: (context) => !!context.player.opponent,
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    duration: 'lastingEffect',
                    target: context.source,
                    effect: ability.effects.takeControl(context.player.opponent)
                }))
            }
        });

        this.scrap({
            target: {
                cardType: 'artifact',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: {
                target: {
                    cardType: 'artifact',
                    controller: 'opponent',
                    gameAction: ability.actions.destroy()
                },
                message: '{0} uses {1} to destroy {2}',
                messageArgs: (context) => [context.player, context.source, context.target]
            }
        });
    }
}

GegrrokuuSapper.id = 'gegrrŏkŭŭ-sapper';

module.exports = GegrrokuuSapper;
