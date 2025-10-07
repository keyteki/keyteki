import Card from '../../Card.js';

class SpooKeyCharge extends Card {
    // Play: If you are haunted, forge a key at current cost. Shuffle
    // your discard pile into your deck.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.conditional((context) => ({
                condition: context.player.isHaunted(),
                trueGameAction: ability.actions.forgeKey()
            })),
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.returnToDeck((context) => ({
                    shuffle: true,
                    target: context.player.discard
                }))
            }
        });
    }
}

SpooKeyCharge.id = 'spoo-key-charge';

export default SpooKeyCharge;
