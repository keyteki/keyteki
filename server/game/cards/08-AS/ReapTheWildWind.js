import _ from 'underscore';
import Card from '../../Card.js';

class ReapTheWildWind extends Card {
    // Play: Each player reveals a random card from their hand and
    // gains 1A for each A bonus icon on their revealed card.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.reveal((context) => ({
                location: 'hand',
                chatMessage: true,
                target: _.shuffle(context.player.hand)
                    .slice(0, 1)
                    .concat(
                        context.player.opponent
                            ? _.shuffle(context.player.opponent.hand).slice(0, 1)
                            : []
                    )
            })),
            effect: "reveal a random card from each player's hand",
            then: (
                preThenContext,
                revealedCards = preThenContext.ability.gameAction[0].target
            ) => ({
                gameAction: [
                    ability.actions.gainAmber((context) => ({
                        target: context.player,
                        amount: revealedCards
                            .filter((card) => card.controller === context.player)
                            .reduce(
                                (acc, card) =>
                                    acc + card.bonusIcons.filter((icon) => icon === 'amber').length,
                                0
                            )
                    })),
                    ability.actions.gainAmber((context) => ({
                        target: context.player.opponent,
                        amount: revealedCards
                            .filter((card) => card.controller === context.player.opponent)
                            .reduce(
                                (acc, card) =>
                                    acc + card.bonusIcons.filter((icon) => icon === 'amber').length,
                                0
                            )
                    }))
                ],
                message: '{0} uses {1} to gain {3} amber, and {4} gains {5} amber',
                messageArgs: (context) => [
                    revealedCards
                        .filter((card) => card.controller === context.player)
                        .reduce(
                            (acc, card) =>
                                acc + card.bonusIcons.filter((icon) => icon === 'amber').length,
                            0
                        ),
                    context.player.opponent,
                    revealedCards
                        .filter((card) => card.controller === context.player.opponent)
                        .reduce(
                            (acc, card) =>
                                acc + card.bonusIcons.filter((icon) => icon === 'amber').length,
                            0
                        )
                ]
            })
        });
    }
}

ReapTheWildWind.id = 'reap-the-wild-wind';

export default ReapTheWildWind;
