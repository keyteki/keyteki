const Card = require('../../Card.js');

class UntrumsSerenity extends Card {
    // Omega.
    // Play: Destroy each creature and artifact. Each player discards their archives and their hand, then refills their hand as if it were their "draw cards" step.
    setupCardAbilities(ability) {
        this.play({
            effect: "destroy each creature and artifact, discard {1} from their archives and {2} from their hand, discard {3} from {4}'s archives and {5} from {4}'s hand, then refill hands",
            effectArgs: (context) => [
                context.player.archives.length > 0 ? context.player.archives : 'nothing',
                context.player.hand.length > 0 ? context.player.hand : 'nothing',
                context.player.opponent && context.player.opponent.archives.length > 0
                    ? context.player.opponent.archives
                    : 'nothing',
                context.player.opponent,
                context.player.opponent && context.player.opponent.hand.length > 0
                    ? context.player.opponent.hand
                    : 'nothing'
            ],
            gameAction: [
                ability.actions.destroy((context) => ({
                    target: context.game.cardsInPlay
                })),
                ability.actions.discard((context) => ({
                    target: context.player.archives.concat(
                        context.player.opponent ? context.player.opponent.archives : []
                    )
                })),
                ability.actions.discard((context) => ({
                    target: context.player.hand.concat(
                        context.player.opponent ? context.player.opponent.hand : []
                    )
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
