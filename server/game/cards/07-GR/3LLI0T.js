import Card from '../../Card.js';

class ThreeLLI0T extends Card {
    // Play/After Fight/After Reap: You may play an upgrade from your
    // discard pile on 3LL-I0T.
    //
    // Scrap: Shuffle all upgrades from play into their owners’ decks.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            fight: true,
            target: {
                controller: 'self',
                location: 'discard',
                cardType: 'upgrade',
                gameAction: ability.actions.playUpgradeOnParent((context) => ({
                    parent: context.source
                }))
            }
        });

        this.scrap({
            gameAction: [
                ability.actions.returnToDeck((context) => ({
                    target: context.game.cardsInPlay.flatMap(
                        (card) => card.upgrades.filter((u) => u.owner === context.player) || []
                    ),
                    shuffle: true
                })),
                ability.actions.returnToDeck((context) => ({
                    target: context.game.cardsInPlay.flatMap(
                        (card) =>
                            card.upgrades.filter((u) => u.owner === context.player.opponent) || []
                    ),
                    shuffle: true,
                    shufflePlayer: context.player.opponent
                }))
            ]
        });
    }
}

ThreeLLI0T.id = '3ll-i0t';

export default ThreeLLI0T;
