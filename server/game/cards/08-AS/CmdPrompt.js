const Card = require('../../Card.js');

class CmdPrompt extends Card {
    // After Reap: You may play a non-Logos card this turn.
    setupCardAbilities(ability) {
        this.reap({
            effect: 'allow them to play one non-Logos card this turn',
            gameAction: ability.actions.untilEndOfPlayerTurn({
                effect: ability.effects.canPlayNonHouse('logos')
            })
        });
    }
}

CmdPrompt.id = 'cmd-prompt';

module.exports = CmdPrompt;
