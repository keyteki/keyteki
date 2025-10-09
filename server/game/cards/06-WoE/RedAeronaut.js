const Card = require('../../Card.js');

class RedAeronaut extends Card {
    // Play: Search your deck and discard pile for a Nautilixian and
    // put it into play, then shuffle your deck.
    //
    // Action: A friendly Nautilixian gets +5 power for the remainder
    // of the turn.
    setupCardAbilities(ability) {
        this.play({
            effect:
                'search their deck and discard for a Nautilixian and put it into play, and shuffle their deck',
            target: {
                controller: 'self',
                location: ['discard', 'deck'],
                cardType: 'creature',
                cardCondition: (card) => card.name === 'Nautilixian',
                optional: true,
                gameAction: [ability.actions.putIntoPlay(), ability.actions.shuffleDeck()]
            }
        });

        this.action({
            effect: 'a friendly Nautilixian gets +5 power for the remainder of the turn',
            target: {
                controller: 'self',
                cardCondition: (card) => card.name === 'Nautilixian',
                gameAction: ability.actions.cardLastingEffect({
                    duration: 'untilEndOfTurn',
                    effect: ability.effects.modifyPower(5)
                })
            }
        });
    }
}

RedAeronaut.id = 'red-aeronaut';

module.exports = RedAeronaut;
