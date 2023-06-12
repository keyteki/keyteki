const Card = require('../../Card.js');

class CornerTheMarket extends Card {
    // Play: During your opponent's next turn, they cannot play cards,
    // and each time they discard a card from their hand, they may
    // instead archive that card.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => !!context.player.opponent,
            effect:
                'stop {1} from playing cards next turn; when they discard a card, they may archive it instead',
            effectArgs: (context) => context.player.opponent,
            effectAlert: true,
            gameAction: [
                ability.actions.nextRoundEffect({
                    targetController: 'opponent',
                    effect: ability.effects.cardCannot('play')
                }),
                ability.actions.nextRoundEffect({
                    targetController: 'opponent',
                    when: {
                        onCardDiscarded: (event) => event.location === 'hand'
                    },
                    triggeredAbilityType: 'interrupt',
                    gameAction: ability.actions.sequential([
                        ability.actions.archive((context) => ({
                            reveal: true,
                            target: context.event.card,
                            promptWithHandlerMenu: {
                                optional: true,
                                activePromptTitle: 'Archive instead?',
                                cards: [context.event.card],
                                choices: ['Discard'],
                                handlers: [
                                    () => {
                                        context.event.doNotCancelDiscard = true;
                                    }
                                ]
                            }
                        })),
                        ability.actions.conditional({
                            condition: (context) => !context.event.doNotCancelDiscard,
                            trueGameAction: ability.actions.changeEvent((context) => ({
                                event: context.event,
                                cancel: true
                            }))
                        })
                    ])
                })
            ]
        });
    }
}

CornerTheMarket.id = 'corner-the-market';

module.exports = CornerTheMarket;
