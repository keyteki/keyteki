import Card from '../../Card.js';

class DiveDeep extends Card {
    // Play: Discard the top card of your opponent's deck. Put a creature that shares a house with that card on the bottom of its owner's deck.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent.deck.length > 0,
            gameAction: ability.actions.discard((context) => ({
                target: context.player.opponent.deck.slice(0, 1)
            })),
            then: {
                target: {
                    cardCondition: (card, context) =>
                        context.preThenEvent.card.getHouses().some((house) => card.hasHouse(house)),
                    cardType: 'creature',
                    gameAction: ability.actions.returnToDeck({ bottom: true })
                }
            }
        });
    }
}

DiveDeep.id = 'dive-deep';

export default DiveDeep;
