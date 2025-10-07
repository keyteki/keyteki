import Card from '../../Card.js';

class Hamstrung extends Card {
    // Play: Discard the top card of a player's deck. If it is a creature, purge it.
    setupCardAbilities(ability) {
        this.play({
            target: {
                mode: 'select',
                choices: {
                    Mine: () => true,
                    "Opponent's": (context) => context.player.opponent
                }
            },
            effect: "discard {1} from the top of {2}'s deck{3}",
            effectArgs: (context) => [
                context.select === 'Mine'
                    ? context.player.deck.length > 0
                        ? context.player.deck[0]
                        : 'nothing'
                    : context.player.opponent.deck.length > 0
                    ? context.player.opponent.deck[0]
                    : 'nothing',
                context.select === 'Mine' ? context.player : context.player.opponent,
                context.select === 'Mine'
                    ? context.player.deck.length > 0 && context.player.deck[0].type === 'creature'
                        ? ' and purge it'
                        : ''
                    : context.player.opponent.deck.length > 0 &&
                      context.player.opponent.deck[0].type === 'creature'
                    ? ' and purge it'
                    : ''
            ],
            gameAction: ability.actions.discardTopOfDeck((context) => ({
                target: context.select === 'Mine' ? context.player : context.player.opponent
            })),
            then: (preThenContext) => ({
                condition: (context) =>
                    preThenContext.select === 'Mine'
                        ? context.player.discard[0].type === 'creature'
                        : context.player.opponent.discard[0].type === 'creature',
                gameAction: ability.actions.purge((context) => ({
                    target:
                        preThenContext.select === 'Mine'
                            ? context.player.discard[0]
                            : context.player.opponent.discard[0]
                }))
            })
        });
    }
}

Hamstrung.id = 'hamstrung';

export default Hamstrung;
