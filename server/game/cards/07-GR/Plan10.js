import Card from '../../Card.js';

class Plan10 extends Card {
    // At the end of each player's turn, return a card from under Plan
    // 10 to its owner’s hand. If there are no cards under Plan 10, destroy
    // Plan 10.
    //
    // Play: Put each non-Mars creature faceup under Plan 10.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.placeUnder((context) => ({
                parent: context.source,
                target: context.game.creaturesInPlay.filter((c) => !c.hasHouse('mars'))
            }))
        });

        this.interrupt({
            when: {
                onRoundEnded: () => true
            },
            useEventPlayer: true,
            target: {
                location: 'any',
                cardCondition: (card, context) => context.source.childCards.includes(card),
                gameAction: ability.actions.returnToHand({
                    location: 'under'
                })
            },
            then: {
                alwaysTriggers: true,
                condition: (context) => context.source.childCards.length === 0,
                message: '{0} is destroyed as there are no cards under it',
                gameAction: ability.actions.destroy()
            }
        });
    }
}

Plan10.id = 'plan-10';

export default Plan10;
