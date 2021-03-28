const Card = require('../../Card.js');

class PrescriptiveGrammarbot extends Card {
    setupCardAbilities(ability) {
        this.reap({
            target: {
                mode: 'exactly',
                numCards: 1,
                cardType: 'creature'
            },
            message: '{0} uses {1} to enrage {2}',
            messageArgs: (context) => [context.player, context.source, context.target],
            gameAction: [ability.actions.enrage((context) => ({ target: context.target }))]
        });
    }
}

PrescriptiveGrammarbot.id = 'prescriptive-grammarbot';

module.exports = PrescriptiveGrammarbot;
