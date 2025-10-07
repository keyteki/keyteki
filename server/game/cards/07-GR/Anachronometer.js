import Card from '../../Card.js';

function anachronometerAbility(ability) {
    return {
        effect:
            'shuffle their discard into their deck, draw a card, and discard the top {1} cards of the deck',
        effectArgs: (context) => [
            context.player.opponent ? context.player.opponent.discard.length : 0
        ],
        gameAction: ability.actions.sequential([
            ability.actions.returnToDeck((context) => ({
                shuffle: true,
                target: context.player.discard
            })),
            ability.actions.draw(),
            ability.actions.conditional({
                condition: (context) => !!context.player.opponent,
                trueGameAction: ability.actions.discard((context) => ({
                    target: context.player.deck.slice(
                        0,
                        Math.min(
                            context.player.opponent ? context.player.opponent.discard.length : 0,
                            context.player.deck.length
                        )
                    )
                }))
            })
        ])
    };
}

class Anachronometer extends Card {
    // This creature gains: "After Fight/After Reap: Shuffle your
    // discard pile into your deck. Draw a card. Discard X cards from
    // the top of your deck, where X is the number of cards in your
    // opponent's discard pile."
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', anachronometerAbility(ability))
        });

        this.whileAttached({
            effect: ability.effects.gainAbility('fight', anachronometerAbility(ability))
        });
    }
}

Anachronometer.id = 'anachronometer';

export default Anachronometer;
