const Card = require('../../Card.js');
const _ = require('underscore');

class RuthlessAvenger extends Card {
    // Assault 2. Hazardous 2.
    // Fate: Purge 2 random cards from your discard pile. Shuffle your discard pile into your deck.
    setupCardAbilities(ability) {
        this.fate({
            gameAction: ability.actions.purge((context) => ({
                target: _.shuffle(context.game.activePlayer.discard).slice(0, 2)
            })),
            then: {
                gameAction: ability.actions.returnToDeck((context) => ({
                    target: context.game.activePlayer.discard,
                    shuffle: true,
                    shuffleDiscardIntoDeck: true
                })),
                message: '{0} uses {1} to make {3} shuffle their discard pile into their deck',
                messageArgs: (context) => context.game.activePlayer,
                effectAlert: true
            }
        });
    }
}

RuthlessAvenger.id = 'ruthless-avenger';

module.exports = RuthlessAvenger;
