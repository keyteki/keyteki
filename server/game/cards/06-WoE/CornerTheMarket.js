const Card = require('../../Card.js');

class CornerTheMarket extends Card {
    // Play: During your opponent's next turn, they cannot
    // play cards, and each time they discard a card from
    // their hand, they may archive that card from their
    // discard pile.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect:
                'stop {1} from playing cards next turn; when they discard a card, they may archive it from their discard pile',
            effectArgs: (context) => context.player.opponent,
            effectAlert: true,
            gameAction: [
                ability.actions.nextRoundEffect({
                    targetController: 'opponent',
                    effect: ability.effects.cardCannot('play')
                }),
                ability.actions.nextRoundEffect({
                    preferActionPromptMessage: true,
                    targetController: 'opponent',
                    when: { onCardDiscarded: (event) => event.location === 'hand' },
                    gameAction: ability.actions.sequential([
                        ability.actions.changeEvent((context) => ({
                            event: context.event,
                            cancel: false
                        })),
                        ability.actions.archive((context) => ({
                            reveal: true,
                            target: context.event.card,
                            promptWithHandlerMenu: {
                                activePromptTitle: 'Archive card?',
                                cards: [context.event.card],
                                choices: ['Discard'],
                                handlers: [() => {}],
                                message: '{0} uses {1} to archive {2}',
                                optional: true
                            }
                        }))
                    ])
                })
            ]
        });
    }
}

CornerTheMarket.id = 'corner-the-market';

module.exports = CornerTheMarket;
