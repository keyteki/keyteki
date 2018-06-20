const DrawCard = require('../../drawcard.js');

class ThePathOfMan extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain 2 fate',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && event.conflict.skillDifference >= 5
            },
            gameAction: ability.actions.gainFate({ amount: 2 })
        });
    }
}

ThePathOfMan.id = 'the-path-of-man';

module.exports = ThePathOfMan;
