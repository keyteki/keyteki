import Card from '../../Card.js';

class ShakedownSullivan extends Card {
    // After Reap: Choose a creature and discard the top card of its
    // controller's deck. If that card shares a housewith the chosen creature,
    // its controller gains 1Aember icon. Otherwise, destroy that creature.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'creature',
                location: 'play area',
                gameAction: ability.actions.discard((context) => ({
                    target: context.target.controller.deck.length
                        ? context.target.controller.deck[0]
                        : []
                }))
            },
            effect: 'choose {1} and discard {2}',
            effectArgs: (context) => [context.target, context.target.controller.deck[0]],
            then: (preThenContext) => ({
                alwaysTriggers: true,
                gameAction: ability.actions.conditional((context) => ({
                    condition: context.preThenEvent.card
                        .getHouses()
                        .some((house) => preThenContext.target.hasHouse(house)),
                    trueGameAction: ability.actions.gainAmber({
                        amount: 1,
                        target: preThenContext.target.controller
                    }),
                    falseGameAction: ability.actions.destroy({
                        target: preThenContext.target
                    })
                }))
            })
        });
    }
}

ShakedownSullivan.id = 'shakedown-sullivan';

export default ShakedownSullivan;
