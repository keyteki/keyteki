import Card from '../../Card.js';

class WindrowComposting extends Card {
    // Play: Shuffle a card from your discard pile into your deck.
    // Fate: Each player shuffles their discard pile into their deck.
    setupCardAbilities(ability) {
        this.play({
            target: {
                controller: 'self',
                location: 'discard',
                gameAction: ability.actions.returnToDeck({ shuffle: true })
            }
        });

        this.fate({
            effect: 'have each player shuffle their discard pile into their deck',
            gameAction: [
                ability.actions.returnToDeck((context) => ({
                    shuffle: true,
                    shuffleDiscardIntoDeck: true,
                    target: context.player.discard
                })),
                ability.actions.conditional((context) => ({
                    condition: !!context.player.opponent,
                    trueGameAction: ability.actions.returnToDeck((context) => ({
                        shuffle: true,
                        shufflePlayer: context.player.opponent,
                        target: context.player.opponent ? context.player.opponent.discard : []
                    }))
                }))
            ]
        });
    }
}

WindrowComposting.id = 'windrow-composting';

export default WindrowComposting;
