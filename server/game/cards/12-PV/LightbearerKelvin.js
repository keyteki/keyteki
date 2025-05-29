const Card = require('../../Card.js');

class LightbearerKelvin extends Card {
    // After Fight: Discard the bottom card of a player's deck. If it is a creature, put it into play under your control.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                mode: 'select',
                choices: {
                    'My Deck': () => true,
                    "Opponent's Deck": (context) => !!context.player.opponent
                }
            },
            gameAction: ability.actions.discard((context) => ({
                target:
                    context.select === 'My Deck'
                        ? context.player.deck.length > 0
                            ? context.player.deck[context.player.deck.length - 1]
                            : null
                        : context.player.opponent.deck.length > 0
                        ? context.player.opponent.deck[context.player.opponent.deck.length - 1]
                        : null
            })),
            then: {
                condition: (context) => {
                    const card = context.preThenEvent.card;
                    return card && card.type === 'creature';
                },
                alwaysTriggers: true,
                gameAction: ability.actions.putIntoPlay((context) => ({
                    myControl: true,
                    target: context.preThenEvent.card
                })),
                message: '{0} uses {1} to put {3} into play under their control',
                messageArgs: (context) => [context.preThenEvent.card]
            }
        });
    }
}

LightbearerKelvin.id = 'lightbearer-kelvin';

module.exports = LightbearerKelvin;
