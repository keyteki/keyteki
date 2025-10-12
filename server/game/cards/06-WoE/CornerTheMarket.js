const Card = require('../../Card.js');

class CornerTheMarket extends Card {
    // Play: During your opponent's next turn, they cannot play cards,
    // and each time they discard a card from their hand, they may
    // archive that card from their discard pile.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect:
                'stop {1} from playing cards during their next turn; after {1} discards a card, they may archive that card from their discard pile instead',
            effectArgs: (context) => context.player.opponent,
            effectAlert: true,
            gameAction: [
                ability.actions.duringOpponentNextTurn({
                    targetController: 'opponent',
                    effect: ability.effects.cardCannot('play')
                }),
                ability.actions.duringOpponentNextTurn({
                    targetController: 'opponent',
                    when: {
                        onCardDiscarded: (event, context) =>
                            event.location === 'hand' && event.card.controller === context.player
                    },
                    triggeredAbilityType: 'reaction',
                    preferActionPromptMessage: true,
                    gameAction: ability.actions.archive((context) => ({
                        reveal: true,
                        target: context.event.card,
                        promptWithHandlerMenu: {
                            optional: true,
                            activePromptTitle: 'Archive?',
                            cards: [context.event.card],
                            choices: ['Discard'],
                            handlers: [() => {}],
                            message: '{0} uses {1} to archive {2} from the discard pile',
                            messageArgs: (cards) => [context.player, context.source, cards]
                        }
                    }))
                })
            ]
        });
    }
}

CornerTheMarket.id = 'corner-the-market';

module.exports = CornerTheMarket;
