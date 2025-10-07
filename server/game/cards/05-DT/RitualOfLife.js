import Card from '../../Card.js';

class RitualOfLife extends Card {
    // Action: Destroy a friendly creature. If you do, return a different creature from your discard pile to your hand.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.destroy()
            },
            then: (preThenContext) => ({
                target: {
                    cardType: 'creature',
                    controller: 'self',
                    location: 'discard',
                    cardCondition: (card) => card !== preThenContext.target,
                    gameAction: ability.actions.returnToHand({ location: 'discard' })
                }
            })
        });
    }
}

RitualOfLife.id = 'ritual-of-life';

export default RitualOfLife;
