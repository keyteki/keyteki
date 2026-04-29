const Card = require('../../Card.js');

class VictorFlux extends Card {
    // After Reap: Purge a card from your discard pile. If you do, until
    // the start of your next turn, your opponent cannot play cards of
    // the purged card's type.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                location: 'discard',
                controller: 'self',
                gameAction: ability.actions.purge({ location: 'discard' })
            },
            then: (preThenContext) => {
                const purgedType = preThenContext.target && preThenContext.target.type;
                return {
                    condition: () => !!purgedType,
                    effect: 'stop {1} from playing cards of type {2}',
                    effectArgs: (context) => [context.player.opponent, purgedType],
                    effectAlert: true,
                    gameAction: ability.actions.duringOpponentNextTurn({
                        targetController: 'opponent',
                        effect: ability.effects.playerCannot(
                            'play',
                            (sourceContext) =>
                                purgedType && sourceContext.source.type === purgedType
                        )
                    })
                };
            }
        });
    }
}

VictorFlux.id = 'victor-flux';

module.exports = VictorFlux;
