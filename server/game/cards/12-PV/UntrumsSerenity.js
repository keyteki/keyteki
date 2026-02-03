const Card = require('../../Card.js');

class UntrumsSerenity extends Card {
    // Omega.
    // Play: Destroy each creature and artifact. Each player discards their archives and their hand, then refills their hand as if it were their "draw cards" step.
    setupCardAbilities(ability) {
        this.play({
            effect: "destroy {1}'s creatures ({2}) and artifacts ({3}), and destroy {4}'s creatures ({5}) and artifacts ({6})",
            effectArgs: (context) => [
                context.player,
                context.player.creaturesInPlay ? context.player.creaturesInPlay : 'none',
                context.player.artifactsInPlay ? context.player.artifactsInPlay : 'none',
                context.player.opponent,
                context.player.opponent.creaturesInPlay
                    ? context.player.opponent.creaturesInPlay
                    : 'none',
                context.player.opponent.artifactsInPlay
                    ? context.player.opponent.artifactsInPlay
                    : 'none'
            ],
            gameAction: [
                ability.actions.destroy((context) => ({
                    target: context.game.cardsInPlay
                })),
                ability.actions.discardEntireLocation((context) => ({
                    location: 'archives',
                    target: [context.player, context.player.opponent]
                })),
                ability.actions.discardEntireLocation((context) => ({
                    location: 'hand',
                    target: [context.player, context.player.opponent]
                }))
            ],
            then: {
                alwaysTriggers: true,
                gameAction: [
                    ability.actions.draw((context) => ({
                        target: context.player,
                        refill: true
                    })),
                    ability.actions.draw((context) => ({
                        target: context.player.opponent,
                        refill: true
                    }))
                ]
            }
        });
    }
}

UntrumsSerenity.id = 'untrum-s-serenity';

module.exports = UntrumsSerenity;
