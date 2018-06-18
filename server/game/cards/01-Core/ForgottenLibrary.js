const DrawCard = require('../../drawcard.js');

class ForgottenLibrary extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Draw a card',
            when: {
                onPhaseStarted: event => event.phase === 'draw'
            },
            gameAction: ability.actions.draw()
        });
    }
}

ForgottenLibrary.id = 'forgotten-library';

module.exports = ForgottenLibrary;
