const Card = require('../../Card.js');

class AGiftOfAmber extends Card {
    // Play: Destroy up to 2 creatures. For each creature destroyed
    // this way, the creature's controller gains 1A.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'upTo',
                numCards: 2,
                cardType: 'creature',
                gameAction: ability.actions.destroy()
            },
            then: {
                alwaysTriggers: true,
                gameAction: [
                    ability.actions.gainAmber((context) => ({
                        target: context.player,
                        amount: Math.ceil(
                            context.preThenEvents.filter(
                                (event) =>
                                    !event.cancelled && event.clone.controller === context.player
                            ).length
                        )
                    })),
                    ability.actions.gainAmber((context) => ({
                        target: context.player.opponent,
                        amount: Math.ceil(
                            context.preThenEvents.filter(
                                (event) =>
                                    !event.cancelled &&
                                    event.clone.controller === context.player.opponent
                            ).length
                        )
                    }))
                ],
                message: '{0} uses {1} to gain {3} amber, and {4} gains {5} amber',
                messageArgs: (context) => [
                    Math.ceil(
                        context.preThenEvents.filter(
                            (event) => !event.cancelled && event.clone.controller === context.player
                        ).length
                    ),
                    context.player.opponent,
                    Math.ceil(
                        context.preThenEvents.filter(
                            (event) =>
                                !event.cancelled &&
                                event.clone.controller === context.player.opponent
                        ).length
                    )
                ]
            }
        });
    }
}

AGiftOfAmber.id = 'a-gift-of-æmber';

module.exports = AGiftOfAmber;
