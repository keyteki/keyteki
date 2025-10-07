import Card from '../../Card.js';

class GleamingTheCube extends Card {
    // Play: Ready and use a friendly creature.
    // Fate: Discard the top card of your deck. The discarded card's house becomes your active house.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.use()
                ])
            }
        });

        this.fate({
            gameAction: ability.actions.discard((context) => ({
                target:
                    context.game.activePlayer.deck.length > 0
                        ? context.game.activePlayer.deck[0]
                        : []
            })),
            then: {
                target: {
                    mode: 'house',
                    houses: (context) =>
                        context.preThenEvents.length > 0 && context.preThenEvents[0].card
                            ? context.preThenEvents[0].card.getHouses()
                            : []
                },
                gameAction: ability.actions.changeActiveHouse((context) => ({
                    house: context.house,
                    player: context.game.activePlayer
                })),
                message: '{0} uses {1} to change the active house to {3}',
                messageArgs: (context) => [context.house],
                effectAlert: true
            }
        });
    }
}

GleamingTheCube.id = 'gleaming-the-cube';

export default GleamingTheCube;
