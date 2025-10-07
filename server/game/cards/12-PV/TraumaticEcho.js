import Card from '../../Card.js';

class TraumaticEcho extends Card {
    // Play: Purge a card from your discard pile. During your opponent's next turn,
    // they cannot play cards of the purged card's type.
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.purge()
            },
            then: {
                gameAction: ability.actions.nextRoundEffect((context) => ({
                    targetController: 'opponent',
                    effect: ability.effects.playerCannot(
                        'play',
                        (innerContext) =>
                            innerContext.source.type === context.preThenEvent.card.type
                    )
                })),
                message: '{3} uses {4} to prevent {5} from playing {6} cards next turn',
                messageArgs: (context) => [
                    context.player,
                    context.source,
                    context.player.opponent,
                    context.preThenEvent.card.type
                ],
                effectAlert: true
            }
        });
    }
}

TraumaticEcho.id = 'traumatic-echo';

export default TraumaticEcho;
