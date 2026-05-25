const Card = require('../../Card.js');

class Doppelganger extends Card {
    // At the start of your turn, choose one of Doppelganger's neighbors. For
    // the remainder of the turn, Doppelganger gains the text box of the
    // chosen creature.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onTurnStart: (_, context) => context.player === this.game.activePlayer
            },
            target: {
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.gainsTextBox((context) => ({
                    target: context.source,
                    textBoxSource: context.target
                }))
            },
            message:
                '{0} uses {1} to have {1} gain the text box of {2} for the remainder of the turn',
            messageArgs: (context) => [context.player, context.source, context.target]
        });
    }
}

Doppelganger.id = 'doppelganger';

module.exports = Doppelganger;
